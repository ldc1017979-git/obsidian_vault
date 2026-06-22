# 02-提交与分支管理 SOP

## 1. 分支命名

推荐格式：

```text
feature/功能名称
fix/问题名称
docs/文档名称
chore/维护事项
release/版本号
```

示例：

```text
feature/user-login
fix/order-total-error
docs/github-file-management
chore/update-gitignore
release/v1.2.0
```

## 2. 提交信息格式

推荐格式：

```text
类型: 简短说明
```

常用类型：

| 类型 | 说明 |
|---|---|
| `feat` | 新功能 |
| `fix` | 修复问题 |
| `docs` | 文档修改 |
| `style` | 格式调整，不影响逻辑 |
| `refactor` | 重构 |
| `test` | 测试相关 |
| `chore` | 工程维护 |

示例：

```text
feat: add user import template
fix: correct order total calculation
docs: add GitHub file management guide
chore: update gitignore
```

## 3. 每次提交的范围

一次提交只做一类事情。

推荐：

```text
只改登录功能
只补 README
只调整 .gitignore
只修复一个明确 bug
```

避免：

```text
修 bug + 改 UI + 重命名目录 + 删除旧文件 + 补文档
```

## 4. 日常操作流程

```text
git status
git pull
git checkout -b feature/xxx
修改文件
git status
git add 需要提交的文件
git commit -m "feat: xxx"
git push origin feature/xxx
创建 Pull Request
```

## 5. 合并前检查

- 是否能运行或打开
- 是否有无关文件混入
- 是否有密钥、密码、Token
- 是否更新 README 或文档
- 是否说明了影响范围
- 是否需要补测试或截图

