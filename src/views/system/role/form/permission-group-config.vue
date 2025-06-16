<template>
  <div class="permission-group-config">
    <!-- 角色信息卡片 -->
    <div class="role-info-card">
      <div class="card-header">
        <h4 class="card-title">角色信息</h4>
      </div>
      <div class="role-details">
        <div class="role-item">
          <span class="role-label">角色名称</span>
          <el-tag type="primary" effect="light" size="default">{{
            formData.role.role_name
          }}</el-tag>
        </div>
        <div class="role-item">
          <span class="role-label">显示名称</span>
          <span class="role-value">{{ formData.role.display_name }}</span>
        </div>
      </div>
    </div>

    <!-- 权限组配置区域 -->
    <div class="permission-section">
      <div class="section-header">
        <h4 class="section-title">
          <el-icon class="title-icon" color="var(--el-color-primary)">
            <Key />
          </el-icon>
          权限组配置
        </h4>
        <div
          v-if="
            !formData.loadingPermissionGroups &&
            filteredPermissionGroups.length > 0
          "
          class="section-stats"
        >
          <el-tag
            v-if="isSuperAdmin"
            type="warning"
            effect="light"
            size="small"
          >
            <el-icon><Star /></el-icon>
            超级管理员
          </el-tag>
          <el-tag
            v-else
            :type="checkedPermissionGroupIds.length > 0 ? 'success' : 'info'"
            effect="light"
            size="small"
          >
            已选择 {{ checkedPermissionGroupIds.length }} /
            {{ filteredPermissionGroups.length }} 个权限组
          </el-tag>
        </div>
      </div>

      <!-- 超级管理员提示 -->
      <el-alert
        v-if="isSuperAdmin"
        title="该角色为超级管理员，拥有所有权限"
        type="warning"
        :closable="false"
        show-icon
        class="super-admin-alert"
      >
        <template #default>
          <p>超级管理员角色具有系统的最高权限，无需单独配置权限组。</p>
          <p>如需修改权限，请联系系统管理员或使用其他角色。</p>
        </template>
      </el-alert>

      <!-- 搜索和操作工具栏 -->
      <div
        v-if="
          !formData.loadingPermissionGroups &&
          filteredPermissionGroups.length > 0 &&
          !isSuperAdmin
        "
        class="action-bar"
      >
        <div class="search-container">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索权限组名称、键名或描述..."
            :prefix-icon="Search"
            clearable
            class="search-input"
          />
        </div>
        <div class="action-buttons">
          <el-button
            :disabled="checkedPermissionGroupIds.length === 0"
            plain
            @click="clearAll"
          >
            <el-icon><RefreshLeft /></el-icon>
            清空
          </el-button>
          <el-button
            type="primary"
            :disabled="
              checkedPermissionGroupIds.length ===
              filteredPermissionGroups.length
            "
            plain
            @click="selectAll"
          >
            <el-icon><Select /></el-icon>
            全选
          </el-button>
        </div>
      </div>

      <!-- 权限组列表 -->
      <div
        v-loading="formData.loadingPermissionGroups"
        class="permission-list-container"
      >
        <!-- 空状态 -->
        <div
          v-if="
            !formData.loadingPermissionGroups &&
            filteredPermissionGroups.length === 0 &&
            !isSuperAdmin
          "
          class="empty-container"
        >
          <el-empty
            :image-size="100"
            :description="
              searchKeyword ? '没有找到匹配的权限组' : '暂无权限组数据'
            "
          >
            <template #image>
              <el-icon size="100" color="var(--el-color-info)">
                <FolderOpened />
              </el-icon>
            </template>
            <el-button
              v-if="searchKeyword"
              type="primary"
              @click="searchKeyword = ''"
            >
              清除搜索条件
            </el-button>
          </el-empty>
        </div>

        <!-- 超级管理员权限组显示 -->
        <div v-else-if="isSuperAdmin" class="super-admin-permissions">
          <div class="super-admin-card">
            <div class="super-admin-icon">
              <el-icon size="48" color="var(--el-color-warning)">
                <Star />
              </el-icon>
            </div>
            <div class="super-admin-content">
              <h3 class="super-admin-title">拥有全部权限</h3>
              <p class="super-admin-description">
                超级管理员角色自动拥有系统中所有权限组的完整访问权限，包括：
              </p>
              <ul class="super-admin-features">
                <li>用户管理</li>
                <li>角色管理</li>
                <li>权限管理</li>
                <li>系统配置</li>
                <li>数据管理</li>
                <li>所有其他系统功能</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 普通权限组网格 -->
        <div v-else class="permission-grid">
          <div
            v-for="group in filteredPermissionGroups"
            :key="group.id"
            :class="[
              'permission-card',
              {
                'is-selected': checkedPermissionGroupIds.includes(group.id),
                'is-super-group': group.group_key === '*'
              }
            ]"
            @click="!isSuperAdmin && toggleGroup(group.id)"
          >
            <!-- 超级权限组特殊标识 -->
            <div v-if="group.group_key === '*'" class="super-group-indicator">
              <el-icon size="16" color="var(--el-color-warning)">
                <Star />
              </el-icon>
            </div>

            <!-- 选择状态指示器 -->
            <div class="card-checkbox">
              <el-checkbox
                :model-value="checkedPermissionGroupIds.includes(group.id)"
                :disabled="isSuperAdmin || group.group_key === '*'"
                size="small"
                @change="toggleGroup(group.id)"
                @click.stop
              />
            </div>

            <!-- 权限组内容 -->
            <div class="card-content">
              <div class="group-header">
                <h5 class="group-title">
                  {{
                    group.group_key === "*" ? "全部权限" : group.display_name
                  }}
                </h5>
                <div class="group-meta">
                  <el-tag
                    :type="group.group_key === '*' ? 'warning' : 'info'"
                    :effect="group.group_key === '*' ? 'light' : 'plain'"
                    size="small"
                    class="group-tag"
                  >
                    {{ group.group_key }}
                  </el-tag>
                  <!-- 选中状态小图标 -->
                  <div
                    v-if="checkedPermissionGroupIds.includes(group.id)"
                    class="selected-badge"
                  >
                    <el-icon class="selected-icon" size="14">
                      <Check />
                    </el-icon>
                  </div>
                </div>
              </div>

              <p v-if="group.group_key === '*'" class="group-description super">
                拥有系统中所有功能的完整访问权限，包括用户管理、权限配置、系统设置等所有操作。
              </p>
              <p v-else-if="group.description" class="group-description">
                {{ group.description }}
              </p>
              <p v-else class="group-description placeholder">暂无描述信息</p>
            </div>

            <!-- 选中状态边框高亮 -->
            <div
              v-if="checkedPermissionGroupIds.includes(group.id)"
              class="selected-border"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  Search,
  Key,
  RefreshLeft,
  Select,
  FolderOpened,
  Check,
  Star
} from "@element-plus/icons-vue";
import type { PermissionGroupConfigFormProps } from "../utils/types";

interface Props {
  formData: PermissionGroupConfigFormProps;
}

const props = defineProps<Props>();

// 定义emit
const emit = defineEmits<{
  "update:checkedPermissionGroupIds": [value: string[]];
}>();

// 选中的权限组ID
const checkedPermissionGroupIds = ref<string[]>([]);

// 搜索关键词
const searchKeyword = ref("");

// 过滤后的权限组
const filteredPermissionGroups = computed(() => {
  if (!searchKeyword.value) {
    return props.formData.permissionGroupOptions;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return props.formData.permissionGroupOptions.filter(
    group =>
      group.display_name.toLowerCase().includes(keyword) ||
      group.group_key.toLowerCase().includes(keyword) ||
      (group.description && group.description.toLowerCase().includes(keyword))
  );
});

// 切换权限组选择状态
function toggleGroup(groupId: string) {
  const currentIndex = checkedPermissionGroupIds.value.indexOf(groupId);
  if (currentIndex > -1) {
    checkedPermissionGroupIds.value.splice(currentIndex, 1);
  } else {
    checkedPermissionGroupIds.value.push(groupId);
  }
  emit("update:checkedPermissionGroupIds", [
    ...checkedPermissionGroupIds.value
  ]);
}

// 全选
function selectAll() {
  const allIds = filteredPermissionGroups.value.map(group => group.id);
  checkedPermissionGroupIds.value = [...allIds];
  emit("update:checkedPermissionGroupIds", [...allIds]);
}

// 清空选择
function clearAll() {
  checkedPermissionGroupIds.value = [];
  emit("update:checkedPermissionGroupIds", []);
}

// 监听formData中的选中权限组ID变化
watch(
  () => props.formData.checkedPermissionGroupIds,
  newCheckedIds => {
    console.log("组件接收到新的选中权限组ID:", newCheckedIds);
    checkedPermissionGroupIds.value = [...newCheckedIds];
    console.log("组件内部选中权限组ID已更新:", checkedPermissionGroupIds.value);
  },
  { immediate: true }
);

// 暴露获取选中权限组ID的方法
defineExpose({
  getCheckedPermissionGroupIds: () => checkedPermissionGroupIds.value
});

// 超级管理员检测逻辑
const isSuperAdmin = computed(() => {
  // 检查角色名称是否为超级管理员
  if (
    props.formData.role.role_name === "super_admin" ||
    props.formData.role.role_name === "超级管理员"
  ) {
    return true;
  }

  // 检查是否拥有 group_key 为 "*" 的权限组
  const hasAllPermissions = props.formData.permissionGroupOptions.some(
    group => group.group_key === "*"
  );

  // 检查当前角色是否被分配了全权限组
  const hasAllPermissionsAssigned =
    props.formData.checkedPermissionGroupIds.some(id => {
      const group = props.formData.permissionGroupOptions.find(
        g => g.id === id
      );
      return group && group.group_key === "*";
    });

  return hasAllPermissions && hasAllPermissionsAssigned;
});
</script>

<style scoped>
/* 响应式设计 */
@media (width <= 768px) {
  .permission-group-config {
    padding: 12px;
  }

  .role-details {
    grid-template-columns: 1fr;
  }

  .action-bar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .search-container {
    max-width: none;
  }

  .permission-grid {
    grid-template-columns: 1fr;
  }

  .group-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .group-tag {
    align-self: flex-start;
  }
}

@media (width <= 480px) {
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .permission-card {
    padding: 12px;
  }
}

.permission-group-config {
  padding: 20px;
}

/* 角色信息卡片 */
.role-info-card {
  padding: 20px;
  margin-bottom: 24px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
}

.card-header {
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.card-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.title-icon {
  margin-right: 8px;
}

.role-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.role-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.role-label {
  min-width: 80px;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
}

.role-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

/* 权限组配置区域 */
.permission-section {
  overflow: hidden;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  background: linear-gradient(
    135deg,
    var(--el-color-primary-light-9),
    var(--el-bg-color)
  );
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.section-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-stats {
  display: flex;
  align-items: center;
}

/* 操作工具栏 */
.action-bar {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* 权限组列表容器 */
.permission-list-container {
  min-height: 200px;
  max-height: 400px;
  padding: 20px;
  overflow-y: auto;
  background: var(--el-bg-color-page);
}

/* 空状态 */
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px 20px;
}

/* 权限组网格 */
.permission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* 权限组卡片 */
.permission-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  overflow: hidden;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 2px solid var(--el-border-color-light);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.permission-card:hover {
  border-color: var(--el-color-primary-light-3);
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  transform: translateY(-2px);
}

.permission-card.is-selected {
  background: linear-gradient(
    135deg,
    var(--el-color-primary-light-9) 0%,
    var(--el-bg-color) 100%
  );
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 4px 16px rgb(64 158 255 / 15%);
}

.permission-card.is-selected:hover {
  border-color: var(--el-color-primary-light-3);
  box-shadow: 0 6px 20px rgb(64 158 255 / 20%);
  transform: translateY(-3px);
}

/* 卡片复选框 */
.card-checkbox {
  flex: 0 0 auto;
  margin-top: 2px;
  margin-right: 12px;
}

/* 卡片内容 */
.card-content {
  flex: 1;
  min-width: 0;
}

.group-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.group-title {
  flex: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--el-text-color-primary);
  word-break: break-word;
}

.group-meta {
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  align-items: center;
}

.group-tag {
  font-family: Monaco, Consolas, monospace;
  font-size: 11px;
  font-weight: 500;
}

.group-description {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-line-clamp: 2;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-regular);
  word-break: break-word;
  -webkit-box-orient: vertical;
}

.group-description.placeholder {
  font-style: italic;
  color: var(--el-text-color-placeholder);
}

/* 选中状态边框高亮 */
.selected-border {
  position: absolute;
  top: -2px;
  left: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  pointer-events: none;
  border: 2px solid var(--el-color-primary);
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgb(64 158 255 / 20%);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.permission-card.is-selected .selected-border {
  opacity: 1;
}

/* 选中状态小图标 */
.selected-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: var(--el-color-primary);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgb(64 158 255 / 30%);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.permission-card.is-selected .selected-badge {
  opacity: 1;
  transform: scale(1);
}

.selected-icon {
  font-weight: bold;
  color: white;
}

/* 滚动条样式 */
.permission-list-container::-webkit-scrollbar {
  width: 6px;
}

.permission-list-container::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 3px;
}

.permission-list-container::-webkit-scrollbar-thumb {
  background: var(--el-fill-color-dark);
  border-radius: 3px;
}

.permission-list-container::-webkit-scrollbar-thumb:hover {
  background: var(--el-fill-color-darker);
}

/* 加载状态优化 */
:deep(.el-loading-mask) {
  background-color: rgb(255 255 255 / 80%);
  backdrop-filter: blur(2px);
}

/* Element Plus 组件样式调整 */
:deep(.el-checkbox) {
  display: flex;
  align-items: center;
}

:deep(.el-checkbox__input) {
  margin: 0;
}

:deep(.el-empty__description) {
  margin-top: 16px;
}

:deep(.el-button + .el-button) {
  margin-left: 0;
}

/* 超级管理员样式 */
.super-admin-alert {
  margin: 16px 20px;
}

.super-admin-permissions {
  padding: 40px 20px;
  text-align: center;
}

.super-admin-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  padding: 32px;
  margin: 0 auto;
  background: linear-gradient(
    135deg,
    var(--el-color-warning-light-9),
    var(--el-bg-color)
  );
  border: 2px solid var(--el-color-warning-light-7);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgb(230 162 60 / 15%);
}

.super-admin-icon {
  padding: 16px;
  margin-bottom: 24px;
  background: var(--el-color-warning-light-8);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgb(230 162 60 / 20%);
}

.super-admin-content {
  text-align: center;
}

.super-admin-title {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-color-warning-dark-2);
}

.super-admin-description {
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.super-admin-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0;
  text-align: left;
  list-style: none;
}

.super-admin-features li {
  position: relative;
  padding-left: 20px;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.super-admin-features li::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 6px;
  height: 6px;
  content: "";
  background: var(--el-color-warning);
  border-radius: 50%;
  transform: translateY(-50%);
}

/* 超级权限组特殊样式 */
.permission-card.is-super-group {
  background: linear-gradient(
    135deg,
    var(--el-color-warning-light-9),
    var(--el-bg-color)
  );
  border-color: var(--el-color-warning-light-5);
}

.permission-card.is-super-group:hover {
  border-color: var(--el-color-warning-light-3);
  box-shadow: 0 4px 16px rgb(230 162 60 / 20%);
}

.super-group-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--el-color-warning);
  border: 2px solid var(--el-bg-color);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(230 162 60 / 30%);
}

.group-description.super {
  padding: 8px 12px;
  font-weight: 500;
  color: var(--el-color-warning-dark-2);
  background: var(--el-color-warning-light-9);
  border-left: 3px solid var(--el-color-warning);
  border-radius: 6px;
}
</style>
