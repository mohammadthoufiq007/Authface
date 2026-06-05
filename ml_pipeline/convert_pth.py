import torch
import torch.nn as nn
import torch.nn.functional as F
import os

# MiniFASNetV2 architecture defined inline — no repo needed
class Conv_block(nn.Module):
    def __init__(self, in_c, out_c, kernel=(1,1), stride=(1,1), padding=(0,0), groups=1):
        super().__init__()
        self.conv = nn.Conv2d(in_c, out_c, kernel, stride, padding, groups=groups, bias=False)
        self.bn = nn.BatchNorm2d(out_c)
        self.prelu = nn.PReLU(out_c)
    def forward(self, x):
        return self.prelu(self.bn(self.conv(x)))

class Linear_block(nn.Module):
    def __init__(self, in_c, out_c, kernel=(1,1), stride=(1,1), padding=(0,0), groups=1):
        super().__init__()
        self.conv = nn.Conv2d(in_c, out_c, kernel, stride, padding, groups=groups, bias=False)
        self.bn = nn.BatchNorm2d(out_c)
    def forward(self, x):
        return self.bn(self.conv(x))

class Depth_Wise(nn.Module):
    def __init__(self, in_c, out_c, residual=False, kernel=(3,3), stride=(2,2), padding=(1,1), groups=1):
        super().__init__()
        self.conv = Conv_block(in_c, groups, kernel=(1,1), padding=(0,0))
        self.conv_dw = Conv_block(groups, groups, kernel=kernel, stride=stride, padding=padding, groups=groups)
        self.project = Linear_block(groups, out_c, kernel=(1,1), padding=(0,0))
        self.residual = residual
    def forward(self, x):
        if self.residual:
            short = x
        x = self.conv(x)
        x = self.conv_dw(x)
        x = self.project(x)
        if self.residual:
            x = x + short
        return x

class Residual(nn.Module):
    def __init__(self, c, num_block, groups, kernel=(3,3), stride=(1,1), padding=(1,1)):
        super().__init__()
        self.model = nn.Sequential(*[
            Depth_Wise(c, c, residual=True, kernel=kernel, stride=stride, padding=padding, groups=groups)
            for _ in range(num_block)
        ])
    def forward(self, x):
        return self.model(x)

class MiniFASNetV2(nn.Module):
    def __init__(self, num_classes=3, conv6_kernel=(5,5)):
        super().__init__()
        self.conv1 = Conv_block(3, 64, kernel=(3,3), stride=(2,2), padding=(1,1))
        self.conv2_dw = Conv_block(64, 64, kernel=(3,3), stride=(1,1), padding=(1,1), groups=64)
        self.conv_23 = Depth_Wise(64, 64, kernel=(3,3), stride=(2,2), padding=(1,1), groups=128)
        self.conv_3 = Residual(64, num_block=4, groups=128, kernel=(3,3), stride=(1,1), padding=(1,1))
        self.conv_34 = Depth_Wise(64, 128, kernel=(3,3), stride=(2,2), padding=(1,1), groups=256)
        self.conv_4 = Residual(128, num_block=6, groups=256, kernel=(3,3), stride=(1,1), padding=(1,1))
        self.conv_45 = Depth_Wise(128, 128, kernel=(3,3), stride=(2,2), padding=(1,1), groups=512)
        self.conv_5 = Residual(128, num_block=2, groups=256, kernel=(3,3), stride=(1,1), padding=(1,1))
        self.conv_6_sep = Conv_block(128, 512, kernel=(1,1), stride=(1,1), padding=(0,0))
        self.conv_6_dw = Linear_block(512, 512, kernel=conv6_kernel, stride=(1,1), padding=(0,0), groups=512)
        self.conv_6_flatten = nn.Flatten()
        self.linear = nn.Linear(512, 128)
        self.bn = nn.BatchNorm1d(128)
        self.drop = nn.Dropout(p=0.2)
        self.prob = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2_dw(x)
        x = self.conv_23(x)
        x = self.conv_3(x)
        x = self.conv_34(x)
        x = self.conv_4(x)
        x = self.conv_45(x)
        x = self.conv_5(x)
        x = self.conv_6_sep(x)
        x = self.conv_6_dw(x)
        x = self.conv_6_flatten(x)
        x = self.linear(x)
        x = self.bn(x)
        x = self.drop(x)
        x = self.prob(x)
        return x

# Load weights
print("Loading .pth weights...")
model = MiniFASNetV2(num_classes=3, conv6_kernel=(5,5))
ckpt = torch.load(
    r'C:\Users\Thoufiq\Downloads\2.7_80x80_MiniFASNetV2.pth',
    map_location='cpu',
    weights_only=False
)

# Try all common checkpoint formats
if isinstance(ckpt, dict):
    state = ckpt.get('state_dict', ckpt.get('model', ckpt))
else:
    state = ckpt

model.load_state_dict(state, strict=False)
model.eval()
print("Weights loaded OK")

# Export to ONNX
os.makedirs('models', exist_ok=True)
dummy = torch.randn(1, 3, 80, 80)
out_path = 'models/2.7_80x80_MiniFASNetV2.onnx'

torch.onnx.export(
    model, dummy, out_path,
    input_names=['input'],
    output_names=['output'],
    opset_version=11,
    do_constant_folding=True
)

size = os.path.getsize(out_path)
print(f"Converted successfully!")
print(f"Saved to: {out_path}")
print(f"File size: {size:,} bytes")
