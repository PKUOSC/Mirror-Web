## 镜像配置

CentOS 7镜像配置文件位于`/etc/yum.repos.d/CentOS-Base.repo`。
1. 使用命令修改
    ```bash
    sudo sed -e 's|^mirrorlist=|#mirrorlist=|g' \
              -e 's|^#baseurl=http://mirror.centos.org/$contentdir|baseurl=https://mirrors.pku.edu.cn/centos|g' \
              -i.bak \
              /etc/yum.repos.d/CentOS-Base.repo
    ```
    即将该文件中`baseurl=`行取消注释并改为北大源地址http://mirrors.pku.edu.cn/centos/开头。

    修改文件后需要更新缓存：
    ```bash
    sudo yum makecache
    ```

2. 或直接替换文件

    可通过如下命令直接下载配置文件并替换原有的`/etc/yum.repos.d/CentOS-Base.repo`：
    ```bash
    sudo wget http://mirrors.pku.edu.cn/repoconfig/centos7/CentOS-Base.repo -O /etc/yum.repos.d/CentOS-Base.repo
    ```

    ```unix-conf
    # CentOS-Base.repo
    #
    # The mirror system uses the connecting IP address of the client and the
    # update status of each mirror to pick mirrors that are updated to and
    # geographically close to the client.  You should use this for CentOS updates
    # unless you are manually picking other mirrors.
    #
    # If the mirrorlist= does not work for you, as a fall back you can try the
    # remarked out baseurl= line instead.
    #
    #

    [base]
    name=CentOS-$releasever - Base
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os&infra=$infra
    baseurl=http://mirrors.pku.edu.cn/centos/$releasever/os/$basearch/
    gpgcheck=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

    #released updates
    [updates]
    name=CentOS-$releasever - Updates
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates&infra=$infra
    baseurl=http://mirrors.pku.edu.cn/centos/$releasever/updates/$basearch/
    gpgcheck=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

    #additional packages that may be useful
    [extras]
    name=CentOS-$releasever - Extras
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras&infra=$infra
    baseurl=http://mirrors.pku.edu.cn/centos/$releasever/extras/$basearch/
    gpgcheck=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

    #additional packages that extend functionality of existing packages
    [centosplus]
    name=CentOS-$releasever - Plus
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus&infra=$infra
    baseurl=http://mirrors.pku.edu.cn/centos/$releasever/centosplus/$basearch/
    gpgcheck=1
    enabled=0
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
    ```

    修改文件后需要更新缓存：
    ```bash
    sudo yum makecache
    ```
