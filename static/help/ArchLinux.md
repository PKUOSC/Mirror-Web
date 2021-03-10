## 镜像配置

编辑文件`/etc/pacman.d/mirrorlist`，在开头插入
```unix-conf
## China
Server = http://mirrors.pku.edu.cn/archlinux/$repo/os/$arch
```
以添加并启用北大镜像源。

修改文件`/etc/pacman.d/mirrorlist`后，执行命令
```bash
pacman -Syyu
```
以强制刷新软件包列表。
