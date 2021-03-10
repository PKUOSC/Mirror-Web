## 镜像配置

Ubuntu镜像配置文件位于`/etc/apt/sources.list`。

1. 使用命令修改
    ```bash
    sudo sed -i.bak 's/archive.ubuntu.com/mirrors.pku.edu.cn/g' /etc/apt/sources.list
    ```
    注：该命令表示将`archive.ubuntu.com`替换为`mirrors.pku.edu.cn`。根据不同的时区，被替换的内容可能不是`archive.ubuntu.com`，可通过查看`/etc/apt/sources.list`确定。

    修改文件后需要更新索引：
    ```bash
    sudo apt-get update
    ```

2. 或直接替换文件

    可通过如下命令直接下载配置文件并替换原有的`/etc/apt/sources.list`：
    ```bash
    sudo wget http://mirrors.pku.edu.cn/repoconfig/ubuntu{ubuntu_version}/sources.list -O /etc/apt/sources.list
    ```

    或手动替换文件内容为：
    ```unix-conf
    deb http://mirrors.pku.edu.cn/ubuntu {ubuntu_codename} main restricted universe multiverse
    # deb-src http://mirrors.pku.edu.cn/ubuntu {ubuntu_codename} main restricted universe multiverse

    deb http://mirrors.pku.edu.cn/ubuntu {ubuntu_codename}-updates main restricted universe multiverse
    # deb-src http://mirrors.pku.edu.cn/ubuntu {ubuntu_codename}-updates main restricted universe multiverse

    deb http://mirrors.pku.edu.cn/ubuntu {ubuntu_codename}-backports main restricted universe multiverse
    # deb-src http://mirrors.pku.edu.cn/ubuntu {ubuntu_codename}-backports main restricted universe multiverse

    deb http://mirrors.pku.edu.cn/ubuntu {ubuntu_codename}-security main restricted universe multiverse
    # deb-src http://mirrors.pku.edu.cn/ubuntu {ubuntu_codename}-security main restricted universe multiverse

    ## Uncomment the following two lines to add software from Canonical's
    ## 'partner' repository.
    ## This software is not part of Ubuntu, but is offered by Canonical and the
    ## respective vendors as a service to Ubuntu users.
    # deb http://archive.canonical.com/ubuntu {ubuntu_codename} partner
    # deb-src http://archive.canonical.com/ubuntu {ubuntu_codename} partner
    ```

    修改文件后需要更新索引：
    ```bash
    sudo apt-get update
    ```
