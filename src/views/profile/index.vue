<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>
      <div class="profile-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="avatar-section">
              <el-avatar :size="120" :src="userInfo.avatar" />
              <h3>{{ userInfo.username }}</h3>
              <p>{{ userInfo.email }}</p>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="info-section">
              <el-descriptions title="基本信息" :column="2" border>
                <el-descriptions-item label="用户名">{{
                  userInfo.username
                }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{
                  userInfo.email
                }}</el-descriptions-item>
                <el-descriptions-item label="角色">{{
                  userInfo.role
                }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{
                  userInfo.created_at
                }}</el-descriptions-item>
                <el-descriptions-item label="最后登录">{{
                  userInfo.last_login
                }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag
                    :type="userInfo.status === 'active' ? 'success' : 'danger'"
                  >
                    {{ userInfo.status === "active" ? "正常" : "禁用" }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "UserProfile"
});

const userStore = useUserStoreHook();

const userInfo = ref({
  username: "",
  email: "",
  avatar: "",
  role: "",
  created_at: "",
  last_login: "",
  status: "active"
});

onMounted(() => {
  // 获取用户信息
  userInfo.value = {
    username: userStore.username || "管理员",
    email: "admin@example.com",
    avatar: userStore.avatar || "",
    role: userStore.roles?.[0] || "超级管理员",
    created_at: "2024-01-01",
    last_login: "2024-06-01",
    status: "active"
  };
});
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-content {
  padding: 20px 0;
}

.avatar-section {
  padding: 20px;
  text-align: center;
}

.avatar-section h3 {
  margin: 15px 0 5px;
  color: #303133;
}

.avatar-section p {
  margin: 0;
  color: #909399;
}

.info-section {
  padding: 20px;
}
</style>
