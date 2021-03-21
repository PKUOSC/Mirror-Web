## 镜像配置

1. 临时生效
    ```bash
    pip install -i https://mirrors.pku.edu.cn/pypi/simple package_name
    ```

2. 永久生效
    ```bash
    pip install pip -U -i https://mirrors.pku.edu.cn/pypi/simple # 首先将pip版本升级至10.0.0+
    pip config set global.index-url https://mirrors.pku.edu.cn/pypi/simple
    ```

pip镜像处于测试阶段，如发现任何问题，请发邮件至mirror@pku.edu.cn。
