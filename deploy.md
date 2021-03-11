## 安装运行环境

## linux (ubuntu为例):

### 安装 node & npm 运行时环境

```bash
 sudo apt update #更新系统包

 sudo apt install build-essential # 安装必要的构建软件

 sudo apt install node # 安装默认版本的node & npm
```
命令执行后, node & npm 基础运行环境安装完毕. 接着讲node & npm升级到最新版本

```bash
 sudo npm i -g n # 安装node更新管理器
 
 n latest # 将本地node & npm 更新到最新
```
命令执行后 通过以下命令确认node & npm 运行环境为最新

```bash
 npm -v  # 7.6.x

 node -v # v15.11.x
```

安装 pm2 服务进程管理

```bash
 sudo npm i -g pm2
```

新建项目部署目录

```bash
cd /home && mkdir -p metro # 新建 /home/metro 目录作为项目路径


cd /home/metro

cp /home/dist.zip /home/metro # 将项目部署包 dist.zip 拷贝到此目录下

upzip dist.zip # 解压

```
启动服务

```bash
 pm2 serve dist --spa --name metro 
```