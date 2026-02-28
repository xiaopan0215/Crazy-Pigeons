# 疯狂的鸽子 (Crazy Pigeon) 游戏使用说明
<img width="355" height="754" alt="image" src="https://github.com/user-attachments/assets/24ec88c3-d8ee-40d6-ba62-7a22f69980d1" />
<img width="356" height="773" alt="image" src="https://github.com/user-attachments/assets/f13b4786-6162-44a1-8dce-c8e24b96bea8" />
<img width="344" height="755" alt="image" src="https://github.com/user-attachments/assets/1b1cb78a-a788-4fb2-8d9b-a351beac1188" />
<img width="356" height="773" alt="image" src="https://github.com/user-attachments/assets/265c6476-fc62-43f5-bbc1-05a91695dc0f" />




## 1. 游戏简介

疯狂的鸽子是一款轻松有趣的休闲游戏，玩家控制一只可爱的鸽子在城市天空中飞翔，躲避障碍物并收集道具来获得高分。游戏采用简洁的2D画面风格，操作简单易上手，适合所有年龄段的玩家。

## 2. 安装与运行指南

### 环境要求
- Node.js (版本 16.0 或更高)
- npm 或 yarn 包管理器
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 安装依赖
```bash
# 克隆项目到本地
git clone [项目地址]

# 进入项目目录
cd crazy-pigeon

# 安装依赖包
npm install
# 或者使用 yarn
yarn install
```

### 启动命令
```bash
# 开发模式启动
npm run dev
# 或者
yarn dev

# 构建生产版本
npm run build
# 或者
yarn build

# 预览生产版本
npm run preview
# 或者
yarn preview
```

## 3. 游戏玩法说明

### 操作方式
- **电脑端**: 使用空格键或鼠标点击让鸽子向上飞
- **移动端**: 触摸屏幕让鸽子向上飞
- **重力系统**: 松开按键/触摸时鸽子会受重力影响向下坠落

### 游戏目标
- 控制鸽子在天空中飞行尽可能远的距离
- 躲避各种障碍物（建筑物、气球、飞机等）
- 收集金币和道具来获得额外分数
- 挑战自己的最高分数记录

### 计分规则
- **飞行距离**: 每飞行1米获得1分
- **收集金币**: 每个金币获得10分
- **特殊道具**: 不同道具获得20-50分不等
- **连击奖励**: 连续收集道具可获得额外分数加成

## 4. 开发指南

### 目录结构
```
crazy-pigeon/
├── public/                 # 静态资源
│   ├── images/            # 游戏图片资源
│   ├── sounds/            # 音效文件
│   └── fonts/             # 字体文件
├── src/
│   ├── components/        # React组件
│   │   ├── Game/         # 游戏核心组件
│   │   ├── UI/           # 用户界面组件
│   │   └── Shared/       # 共享组件
│   ├── hooks/            # 自定义React Hooks
│   ├── utils/            # 工具函数
│   ├── assets/           # 资源文件
│   ├── styles/           # 样式文件
│   └── main.tsx          # 应用入口文件
├── docs/                 # 文档
└── package.json          # 项目配置
```

### 关键命令
```bash
# 运行测试
npm test

# 代码格式化
npm run format

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 清理构建缓存
npm run clean
```

## 5. 常见问题

### Q: 游戏无法启动怎么办？
A: 请检查以下几点：
- 确保Node.js版本符合要求 (16.0+)
- 检查是否成功安装了所有依赖包
- 查看控制台是否有错误信息
- 尝试删除node_modules文件夹后重新安装依赖

### Q: 游戏运行卡顿怎么办？
A: 建议尝试以下方法：
- 关闭其他占用资源的程序
- 降低浏览器标签页数量
- 检查浏览器是否为最新版本
- 尝试使用不同的浏览器

### Q: 如何保存游戏进度？
A: 游戏会自动保存您的最高分数到本地浏览器存储中，下次打开时会自动加载您的记录。

### Q: 支持哪些浏览器？
A: 游戏支持所有现代浏览器，包括：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Q: 如何重置游戏数据？
A: 在浏览器控制台中执行以下命令可以重置本地存储的数据：
```javascript
localStorage.clear()
```

## 技术支持

如遇到其他问题，请通过以下方式联系开发团队：
- 提交Issue到项目仓库
- 发送邮件至技术支持邮箱
- 查看项目文档获取更多信息

---

祝您游戏愉快！🕊️
