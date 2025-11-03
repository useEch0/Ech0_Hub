# Ech0 Hub

这里聚合着许多Ech0实例发布的Echo

## 如何加入?

1. 在Github Issue提交自己的实例地址
2. Fork本仓库,并修改仓库目录下`hub/hub.json`文件,在文件中新增你的实例地址后PR

## 自部署？

本项目为纯静态网页，仅需pnpm install && pnpm build即可编译后部署。

> tip: 可以将`.env`文件里的 VITE_HUB_LIST_SOURCE 改成自己的Ech0实例的Connect接口，比如：https://memo.vaaat.com/api/connect/list
