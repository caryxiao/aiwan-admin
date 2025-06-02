<template>
  <div class="main-container">
    <!-- 搜索栏 -->
    <el-card class="search-wrapper">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input
            v-model="searchValue"
            placeholder="请输入用户名或邮箱"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="状态" clearable>
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <Icon icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetSearch">
            <Icon icon="ep:refresh" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格卡片 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <div class="right-menu">
            <el-button
              v-if="hasSelection"
              type="danger"
              @click="handleBatchDelete"
            >
              <Icon icon="ep:delete" />
              批量删除
            </el-button>
            <el-button type="primary" @click="openCreateDialog">
              <Icon icon="ep:plus" />
              新增用户
            </el-button>
            <el-button type="primary" @click="handleExport">
              <Icon icon="ep:download" />
              导出
            </el-button>
            <el-button type="primary" @click="refresh">
              <Icon icon="ep:refresh" />
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="username" label="用户名" min-width="120">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.username }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" min-width="200" />

        <el-table-column prop="full_name" label="姓名" min-width="120" />

        <el-table-column prop="is_active" label="状态" width="100">
          <template #default="{ row, $index }">
            <el-switch
              v-model="row.is_active"
              :loading="switchLoadMap[$index]?.loading"
              active-text="启用"
              inactive-text="禁用"
              @change="() => handleStatusChange(row, $index)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="mfa_enabled" label="双因子认证" width="120">
          <template #default="{ row }">
            <el-tag :type="row.mfa_enabled ? 'success' : 'info'">
              {{ row.mfa_enabled ? "已启用" : "未启用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="last_login_at" label="最后登录" width="180">
          <template #default="{ row }">
            {{
              row.last_login_at ? formatDateTime(row.last_login_at) : "从未登录"
            }}
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-auth="'admin_users:update'"
              type="primary"
              size="small"
              link
              @click="openEditDialog(row)"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:edit" />
              </template>
              编辑
            </el-button>
            <el-button
              v-auth="'admin_users:update'"
              type="warning"
              size="small"
              link
              @click="handleResetPassword(row)"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:key" />
              </template>
              重置密码
            </el-button>
            <el-button
              v-auth="'admin_users:delete'"
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:delete" />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :layout="pagination.layout"
          :total="pagination.total"
          class="pagination"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      draggable
      @close="closeDialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            :disabled="isEditing"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            type="email"
          />
        </el-form-item>

        <el-form-item v-if="!isEditing" label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item v-if="isEditing" label="新密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="留空则不修改密码"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="姓名" prop="full_name">
          <el-input
            v-model="formData.full_name"
            placeholder="请输入姓名（可选）"
          />
        </el-form-item>

        <el-form-item label="状态" prop="is_active">
          <el-switch
            v-model="formData.is_active"
            active-text="激活"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="重置密码"
      width="500px"
      :close-on-click-modal="false"
      draggable
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="passwordForm.password"
            placeholder="请输入新密码"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            placeholder="请再次输入新密码"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="passwordSubmitLoading"
            @click="handlePasswordSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormRules } from "element-plus";
import { Icon } from "@iconify/vue";
import { IconifyIconOffline } from "@/components/ReIcon";
import { formatDateTime } from "@/utils/dateTime";
import { useTable } from "@/composables/useTable";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  type AdminUser,
  type CreateAdminUserRequest,
  type UpdateAdminUserRequest
} from "@/api/system/users";

defineOptions({
  name: "SystemUser"
});

// 搜索表单
const searchForm = reactive({
  status: ""
});

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在 3 到 20 个字符", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" }
  ]
};

// 密码表单验证规则
const passwordRules: FormRules = {
  password: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};

// 使用 useTable 组合式函数
const {
  loading,
  tableData,
  pagination,
  selectedRows: selectedUsers,
  searchValue,
  fetchData,
  handleSearch,
  handleResetSearch,
  handlePageChange,
  handlePageSizeChange,
  handleSelectionChange
} = useTable<AdminUser>({
  fetchApi: getAdminUsers,
  tableConfig: {
    columns: [],
    showSelection: true,
    showIndex: true,
    stripe: true,
    border: true
  },
  searchConfig: {
    placeholder: "请输入用户名或邮箱",
    searchKey: "search"
  },
  transformData: data => data,
  onSuccess: (action, data) => {
    console.log(`${action} 操作成功:`, data);
  },
  onError: (action, error) => {
    console.error(`${action} 操作失败:`, error);
  }
});

// 状态切换加载状态
const switchLoadMap = ref<Record<number, { loading: boolean }>>({});

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const submitLoading = ref(false);
const formRef = ref();
const formData = reactive<CreateAdminUserRequest & { id?: string }>({
  username: "",
  email: "",
  password: "",
  full_name: "",
  is_active: true
});

// 重置密码对话框相关
const passwordDialogVisible = ref(false);
const passwordSubmitLoading = ref(false);
const passwordFormRef = ref();
const passwordForm = reactive({
  password: "",
  confirmPassword: ""
});
const currentPasswordUser = ref<AdminUser | null>(null);

// 打开创建对话框
const openCreateDialog = () => {
  dialogTitle.value = "新增用户";
  isEdit.value = false;
  Object.assign(formData, {
    username: "",
    email: "",
    password: "",
    full_name: "",
    is_active: true
  });
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (row: AdminUser) => {
  dialogTitle.value = "编辑用户";
  isEdit.value = true;
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    email: row.email,
    full_name: row.full_name,
    is_active: row.is_active
  });
  dialogVisible.value = true;
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
  isEdit.value = false;
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(formData, {
    id: "",
    username: "",
    email: "",
    password: "",
    full_name: "",
    is_active: true
  });
};

// 处理状态切换
const handleStatusChange = async (row: AdminUser, index: number) => {
  const action = row.is_active ? "启用" : "禁用";

  try {
    await ElMessageBox.confirm(
      `确认要${action}用户 "${row.username}" 吗？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    switchLoadMap.value[index] = { loading: true };

    const updateData: UpdateAdminUserRequest = {
      is_active: row.is_active
    };

    await updateAdminUser(row.id, updateData);
    ElMessage.success(`已成功${action}用户`);
  } catch (error) {
    if (error !== "cancel") {
      console.error("状态切换失败:", error);
    }
    // 恢复原状态
    row.is_active = !row.is_active;
  } finally {
    switchLoadMap.value[index] = { loading: false };
  }
};

// 处理重置密码
const handleResetPassword = (row: AdminUser) => {
  currentPasswordUser.value = row;
  passwordForm.password = "";
  passwordForm.confirmPassword = "";
  passwordDialogVisible.value = true;
};

// 提交密码重置
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value || !currentPasswordUser.value) return;

  try {
    await passwordFormRef.value.validate();
    passwordSubmitLoading.value = true;

    const updateData: UpdateAdminUserRequest = {
      password: passwordForm.password
    };

    await updateAdminUser(currentPasswordUser.value.id, updateData);
    ElMessage.success("密码重置成功");
    passwordDialogVisible.value = false;
  } catch (error) {
    console.error("密码重置失败:", error);
  } finally {
    passwordSubmitLoading.value = false;
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    if (isEdit.value) {
      const updateData: UpdateAdminUserRequest = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        is_active: formData.is_active
      };
      await updateAdminUser(formData.id!, updateData);
      ElMessage.success("用户更新成功");
    } else {
      const createData: CreateAdminUserRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        is_active: formData.is_active
      };
      await createAdminUser(createData);
      ElMessage.success("用户创建成功");
    }

    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

// 处理删除
const handleDelete = async (row: AdminUser) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？`,
      "确认删除",
      {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    );

    await deleteAdminUser(row.id);
    ElMessage.success("删除成功");
    fetchData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`,
      "确认批量删除",
      {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    );

    await Promise.all(
      selectedUsers.value.map(user => deleteAdminUser(user.id))
    );

    ElMessage.success("批量删除成功");
    fetchData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
    }
  }
};

// 导出功能
const handleExport = () => {
  ElMessage.info("导出功能开发中...");
};

// 刷新
const refresh = () => {
  fetchData();
};

// 重置搜索
const resetSearch = () => {
  searchForm.status = "";
  handleResetSearch();
};

// 计算属性
const hasSelection = computed(() => selectedUsers.value.length > 0);
const isEditing = computed(() => isEdit.value);

// 初始化数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.main-container {
  padding: 16px;
}

.search-wrapper {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.right-menu {
  display: flex;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.text-muted {
  font-style: italic;
  color: #909399;
}

.mb-4 {
  margin-bottom: 16px;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  font-weight: 600;
  color: var(--el-text-color-primary);
  background-color: var(--el-fill-color-light);
}

:deep(.el-pagination) {
  --el-pagination-font-size: 14px;
}
</style>
