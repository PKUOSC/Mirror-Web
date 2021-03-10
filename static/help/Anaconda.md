## 镜像配置

1. 配置

    在用户目录下创建```.condarc```文件并修改为下述内容

    ```
    channels:
        - defaults
    show_channel_urls: true
    default_channels:
        - https://mirrors.pku.edu.cn/anaconda/pkgs/main
        - https://mirrors.pku.edu.cn/anaconda/pkgs/r
    custom_channels:
        conda-forge: https://mirrors.pku.edu.cn/anaconda/cloud
        pytorch: https://mirrors.pku.edu.cn/anaconda/cloud
    ```

    修改后执行下述命令以清除缓存：

    ```conda clean -i```

2. 第三方库

    可按需仿照配置文件中```custom_channels```增加第三方库镜像使用。[第三方库列表](https://mirrors.pku.edu.cn/anaconda/cloud/)

3. 附：软件安装程序

    - Anaconda安装包下载```https://mirrors.pku.edu.cn/anaconda/archive/```
    - Miniconda安装包下载地址```https://mirrors.pku.edu.cn/anaconda/miniconda/```



注：根据Anaconda的用户协议，本镜像仅限教育科研使用。

注：本镜像同步使用由tuna提供的同步脚本[ananconda.py](https://github.com/tuna/tunasync-scripts/blob/master/anaconda.py)
