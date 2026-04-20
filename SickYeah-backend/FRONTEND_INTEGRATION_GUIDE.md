# 前端集成步骤

## 1. 安装依赖

```bash
cd /Users/chris/new-work/SickYeah-Front
npm install axios
```

## 2. 创建 API 文件

在前端项目中创建 `src/api/index.ts`，复制 `FRONTEND_INTEGRATION_EXAMPLE.ts` 的内容。

## 3. 更新 Store

替换 `src/store/useStore.ts` 的内容，参考 `FRONTEND_STORE_EXAMPLE.ts`。

主要改动：
- 移除本地 mock 数据
- 添加 API 调用
- 添加 loading 和 error 状态
- 使用 localStorage 存储 token

## 4. 更新组件

### Login.tsx

```typescript
const handleLogin = async () => {
  try {
    await login(username, password); // 调用 store 的 login 方法
    navigate('/');
  } catch (error) {
    Toast.show({ content: '登录失败，请检查用户名和密码' });
  }
};
```

### RestaurantList.tsx

```typescript
useEffect(() => {
  fetchRestaurants({ status: activeTab }); // 从后端获取数据
}, [activeTab]);
```

### Report.tsx

```typescript
const handleSubmit = async () => {
  if (!form.name || !form.address) {
    Toast.show({ content: '名字和地址是必填的哦！' });
    return;
  }
  
  try {
    await addRestaurant({
      ...form,
      status: 'to-eat',
    });
    Toast.show({ content: '上报成功！出餐啦！', icon: 'success' });
    navigate('/');
  } catch (error) {
    Toast.show({ content: '上报失败，请重试' });
  }
};
```

### RestaurantDetail.tsx

```typescript
const submitReview = async () => {
  try {
    // 1. 创建评价
    const reviewId = await createReview(restaurant.id, selectedRating!, reviewComment);
    
    // 2. 上传照片（如果有）
    if (uploadedPhotos.length > 0) {
      await uploadReviewPhotos(reviewId, uploadedPhotos);
    }
    
    // 3. 更新餐厅状态
    await updateRestaurantStatus(restaurant.id, 'eaten', selectedRating!);
    
    Toast.show({ content: '打卡成功！', icon: 'success' });
    navigate('/restaurants/eaten');
  } catch (error) {
    Toast.show({ content: '打卡失败，请重试' });
  }
};
```

## 5. 配置环境变量（可选）

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

在 API 文件中使用：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
```

## 6. 启动项目

### 启动后端

```bash
cd backend
npm run dev
```

后端运行在 `http://localhost:4000`

### 启动前端

```bash
cd /Users/chris/new-work/SickYeah-Front
npm run dev
```

前端运行在 `http://localhost:3000`

## 7. 测试流程

1. 打开前端 `http://localhost:3000`
2. 注册新用户或登录
3. 上报餐厅
4. 查看待食清单
5. 打卡餐厅并评价
6. 查看已食清单

## 注意事项

1. **CORS**: 后端已配置允许 `http://localhost:3000` 跨域访问
2. **Token**: 登录后 token 会自动保存到 localStorage
3. **认证**: 所有餐厅和评价接口都需要登录
4. **图片上传**: 暂时使用 File 对象，需要通过 FormData 上传
5. **错误处理**: 建议在每个 API 调用处添加 try-catch

## API 接口地址

- 后端 API: `http://localhost:4000/api`
- 健康检查: `http://localhost:4000/health`
- 上传的图片: `http://localhost:4000/uploads/filename.jpg`

## 常见问题

### Q: 跨域问题？
A: 确保后端 `.env` 中的 `CORS_ORIGIN` 设置正确。

### Q: Token 过期？
A: Token 有效期为 7 天，过期后需要重新登录。

### Q: 图片无法上传？
A: 检查图片大小是否超过 5MB，格式是否为 jpeg/jpg/png/gif/webp。

### Q: 数据不同步？
A: 确保在操作后重新调用 `fetchRestaurants()` 刷新列表。
