# HTML5新特性之离线缓存技术

标签（空格分隔）： html离线缓存

---

##前言
   随着Web App的发展，越来越多的移动端App使用HTML5的方式来开发，除了一些HybridApp以外，其他一部分Web App还是通过浏览器来访问的，通过浏览器访问就需要联网发送请求，这样就使得用户在离线的状态下无法使用App，同时WebApp中一部分资源并不是经常改变，并不需要每次都向服务器发出请求，出于这些原因，HTML5提出的一个新的特性：离线存储。
    通过离线存储，我们可以通过把需要离线存储在本地的文件列在一个manifest配置文件中，这样即使在离线的情况下，用户也可以正常使用App。
## 1、什么是html5离线缓存？离线缓存与传统浏览器缓存区别？
###1.1 概述
    HTML5离线缓存又名ApplicationCache，是从浏览器的缓存中分出来的一块缓存区，要想在这个缓存中保存数据，可以使用一个描述文件（manifestfile），列出要下载和缓存的资源。
### 1.2 与传统浏览器缓存区别
    1. 离线缓存是针对整个应用，浏览器缓存是单个文件

    2. 离线缓存断网了还是可以打开页面，浏览器缓存不行

    3. 离线缓存可以主动通知浏览器更新资源

## 2、如何实现HTML5应用程序缓存？
### 2.1 实现步骤
    1.创建一个 cache.manifest 文件，并确保文件具有正确的内容。

    2.所有的HTML文件都指向 cache.manifest。

    3.在服务器上设置内容类型。

### 2.2 Manifest 文件
manifest 文件是简单的文本文件，它告知浏览器被缓存的内容（以及不缓存的内容）。

manifest 文件可分为以几个个部分：

    1、第一行必须是"CACHED MANIFEST"文字，以把本文件的作用告知浏览器，即对本地缓存中的资源文件进行具体设置。

    2、在manifest文件中，可以加上注释来进行一些必要说明或解释。注释行以”#”文字开头。

    3、在CACHE之后的部分为列出我们需要缓存的文件。

    4、在FALLBACK之后的部分每一行中指定两个资源文件，第一个资源文件为能够在线访问时使用的资源文件，第二个资源文件为不能在线访问时使用的备用资源文件。

    5、在NETWORK之后可以指定在线白名单，即列出我们不希望离线存储的文件，因为通常它们的内容需要互联网访问才有意义。

    另外，在此部分我们可以使用快捷方式：通配符*。这将告诉浏览器，应用服务器中获取没有在显示部分中提到的任何文件或URL。

如下是一个简单的manifest配置文件：
```
CACHE MANIFEST
# v0.10

CACHE:
lib/lib/jquery-1.12.4.min.js
lib/echarts.common.min.js
img/chrome.png

NETWORK:
js/index.js
css/index.css
*

FALLBACK:
404.html
```
### 2.3 HTML文件都指向 cache.manifest
在你的页面头部像下面一样加入一个manifest的属性就可以了。
```
<!DOCTYPE HTML>
<html manifest = "cache.manifest">
...
</html>
```
### 2.4 服务器上设置内容类型
真正运行或测试离线web应用程序的时候，需要对服务器进行配置，让服务器支持text/cache-manifest这个MIME类型（在h5中规定manifest文件的MIME类型是text/cache-manifest）。
例如对Apache服务器进行配置的时候，需要找到｛apache_home｝/conf/mime.type这个文件(.htaccess)，并在文件最后添加如下所示代码：

    text/cache-manifest .manifest 。

在微软的IIS服务器中的步骤如下所示：

    (1).右键选择默认网站或需要添加类型的网站，弹出属性对话框

    (2).选择”http头”标签

    (3).在MIME映射下，单击文件类型按钮

    (4).在打开的MIME类型对话框中单击新建按钮

    (5).在关联扩展名文本中输入”manifest”，在内容类型文本框中输入”text/cache-manifest”,然后点击确定按钮。
## 3、浏览器对 manifest 的解析

### 3.1 浏览器是对离线的资源进行管理和加载

1. 在线的情况下，浏览器发现html头部有manifest属性，它会请求manifest文件，如果是第一次访问app，那么浏览器就会根据manifest文件的内容下载相应的资源并且进行离线存储。
如果已经访问过app并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的manifest文件与旧的manifest文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

2. 离线的情况下，浏览器就直接使用离线存储的资源。
###3.2 注意事项
1. 如果服务器对离线的资源进行了更新，那么必须更新manifest文件之后这些资源才能被浏览器重新下载，如果只是更新了资源而没有更新manifest文件的话，浏览器并不会重新下载资源，也就是说还是使用原来离线存储的资源。

2. 对于manifest文件进行缓存的时候需要十分小心，因为可能出现一种情况就是你对manifest文件进行了更新，但是http的缓存规则告诉浏览器本地缓存的manifest文件还没过期，这个情况下浏览器还是使用原来的manifest文件，所以对于manifest文件最好不要设置缓存。

3. 浏览器在下载manifest文件中的资源的时候，它会一次性下载所有资源，如果某个资源由于某种原因下载失败，那么这次的所有更新就算是失败的，浏览器还是会使用原来的资源。

4. 在更新了资源之后，新的资源需要到下次再打开app才会生效，如果需要资源马上就能生效，那么可以使用window.applicationCache.swapCache()方法来使之生效，出现这种现象的原因是浏览器会先使用离线资源加载页面，然后再去检查manifest是否有更新，所以需要到下次打开页面才能生效。
代码如下：
```
applicationCache.addEventListener('updateready', function(e) {
    if (applicationCache.status == applicationCache.UPDATEREADY) {
        applicationCache.swapCache(); //使用新版本资源
        window.location.reload(); //刷新页面
    }
}, false);
```
## 4、建个demo试试
说了这么多，不如自己动手来试试。这里需要说明的是，如果需要看到离线存储的效果，那么你需要把你的网页部署到服务器上，不管是本地还是生产环境服务器中，通过本地文件打开网页是无法体验到离线存储的。
我在我的电脑上跑了一个本地node服务器，通过localhost访问。
简单建了个项目，结构如下
│  404.html
│  cache.manifest
│  index.html
│  README.md
│  server.js
│
├─css
│      index.css
│
├─img
│      chrome.png
│
├─js
│      index.js
│
└─lib
        echarts.common.min.js
        jquery-1.12.4.min.js

manifest文件向下面这样：
```
CACHE MANIFEST
# v0.10

CACHE:
lib/lib/jquery-1.12.4.min.js
lib/echarts.common.min.js
img/chrome.png

NETWORK:
js/index.js
css/index.css
*

FALLBACK:
404.html
```
然后我们访问网页看看效果。