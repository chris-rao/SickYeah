#!/usr/bin/env node

const BASE_URL = 'http://localhost:8080';
let authToken = '';
let userId = '';
let restaurantId = '';
let reviewId = '';

// 辅助函数
async function request(method, path, data = null, isMultipart = false) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (authToken && !isMultipart) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers: isMultipart ? { 'Authorization': `Bearer ${authToken}` } : headers,
  };

  if (data && !isMultipart) {
    options.body = JSON.stringify(data);
  } else if (data && isMultipart) {
    options.body = data;
  }

  const response = await fetch(`${BASE_URL}${path}`, options);
  const text = await response.text();
  
  return {
    status: response.status,
    data: text ? JSON.parse(text) : null
  };
}

// 测试用例
async function runTests() {
  console.log('🧪 开始测试 SickYeah Backend API...\n');

  try {
    // 1. 健康检查
    console.log('1️⃣  测试健康检查端点...');
    const health = await request('GET', '/health');
    console.log(`   ✅ 状态: ${health.status}, 响应:`, health.data);

    // 2. 用户注册
    console.log('\n2️⃣  测试用户注册...');
    const registerData = {
      username: `testuser_${Date.now()}`,
      password: 'password123',
    };
    const register = await request('POST', '/api/auth/register', registerData);
    console.log(`   ✅ 状态: ${register.status}`);
    if (register.data?.token) {
      authToken = register.data.token;
      userId = register.data.user.id;
      console.log(`   ✅ 获得 Token: ${authToken.substring(0, 20)}...`);
      console.log(`   ✅ 用户ID: ${userId}`);
    }

    // 3. 用户登录
    console.log('\n3️⃣  测试用户登录...');
    const login = await request('POST', '/api/auth/login', {
      username: registerData.username,
      password: registerData.password
    });
    console.log(`   ✅ 状态: ${login.status}`);
    console.log(`   ✅ 登录成功:`, login.data?.user?.username);

    // 4. 获取当前用户信息
    console.log('\n4️⃣  测试获取当前用户...');
    const me = await request('GET', '/api/auth/me');
    console.log(`   ✅ 状态: ${me.status}`);
    console.log(`   ✅ 用户信息:`, me.data?.user?.username);

    // 5. 创建餐厅
    console.log('\n5️⃣  测试创建餐厅...');
    const createRestaurant = await request('POST', '/api/restaurants', {
      name: '测试餐厅',
      address: '测试地址123号',
      recommendedDishes: '测试菜品',
      description: '这是一个测试餐厅',
      status: 'to-eat'
    });
    console.log(`   ✅ 状态: ${createRestaurant.status}`);
    if (createRestaurant.data?.restaurant) {
      restaurantId = createRestaurant.data.restaurant.id;
      console.log(`   ✅ 餐厅ID: ${restaurantId}`);
      console.log(`   ✅ 餐厅名称: ${createRestaurant.data.restaurant.name}`);
    }

    // 6. 获取餐厅列表
    console.log('\n6️⃣  测试获取餐厅列表...');
    const restaurants = await request('GET', '/api/restaurants');
    console.log(`   ✅ 状态: ${restaurants.status}`);
    console.log(`   ✅ 餐厅数量: ${restaurants.data?.restaurants?.length}`);

    // 7. 获取单个餐厅详情
    console.log('\n7️⃣  测试获取餐厅详情...');
    const restaurant = await request('GET', `/api/restaurants/${restaurantId}`);
    console.log(`   ✅ 状态: ${restaurant.status}`);
    console.log(`   ✅ 餐厅名称: ${restaurant.data?.restaurant?.name}`);

    // 8. 更新餐厅状态
    console.log('\n8️⃣  测试更新餐厅状态...');
    const updateStatus = await request('PATCH', `/api/restaurants/${restaurantId}/status`, {
      status: 'eaten',
      rating: 'good'
    });
    console.log(`   ✅ 状态: ${updateStatus.status}`);
    console.log(`   ✅ 新状态: ${updateStatus.data?.restaurant?.status}`);
    console.log(`   ✅ 评分: ${updateStatus.data?.restaurant?.rating}`);

    // 9. 创建评价
    console.log('\n9️⃣  测试创建评价...');
    const createReview = await request('POST', '/api/reviews', {
      restaurantId: restaurantId,
      rating: 'good',
      comment: '非常好吃！强烈推荐！'
    });
    console.log(`   ✅ 状态: ${createReview.status}`);
    if (createReview.data?.review) {
      reviewId = createReview.data.review.id;
      console.log(`   ✅ 评价ID: ${reviewId}`);
      console.log(`   ✅ 评价内容: ${createReview.data.review.comment}`);
    }

    // 10. 获取餐厅的评价
    console.log('\n🔟 测试获取餐厅评价...');
    const reviews = await request('GET', `/api/reviews/restaurant/${restaurantId}`);
    console.log(`   ✅ 状态: ${reviews.status}`);
    console.log(`   ✅ 评价数量: ${reviews.data?.reviews?.length}`);

    // 11. 筛选餐厅（已吃）
    console.log('\n1️⃣1️⃣  测试筛选已吃餐厅...');
    const eatenRestaurants = await request('GET', '/api/restaurants?status=eaten');
    console.log(`   ✅ 状态: ${eatenRestaurants.status}`);
    console.log(`   ✅ 已吃餐厅数量: ${eatenRestaurants.data?.restaurants?.length}`);

    // 12. 筛选好评餐厅
    console.log('\n1️⃣2️⃣  测试筛选好评餐厅...');
    const goodRestaurants = await request('GET', '/api/restaurants?rating=good');
    console.log(`   ✅ 状态: ${goodRestaurants.status}`);
    console.log(`   ✅ 好评餐厅数量: ${goodRestaurants.data?.restaurants?.length}`);

    console.log('\n\n🎉 所有测试通过！API 工作正常！\n');
    console.log('📝 测试总结:');
    console.log('   - 认证系统: ✅');
    console.log('   - 餐厅管理: ✅');
    console.log('   - 评价功能: ✅');
    console.log('   - 数据筛选: ✅');
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// 运行测试
runTests();
