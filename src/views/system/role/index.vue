<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="搜索">
          <el-input
            v-model="searchValue"
            placeholder="请输入角色名称或显示名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <template #icon>
              <IconifyIconOffline icon="ep:search" />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetSearch">
            <template #icon>
              <IconifyIconOffline icon="ep:refresh" />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格卡片 -->
    <el-card shadow="never" class="table-card">
      <!-- 表格工具栏 -->
      <template #header>
        <div class="card-header">
          <span class="card-title">角色管理</span>
          <div class="card-actions">
            <el-button
              v-auth="'admin:roles:create'"
              type="primary"
              @click="handleOpenCreateDialog"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:plus" />
              </template>
              新增角色
            </el-button>
            <el-button
              v-auth="'admin:roles:delete'"
              type="danger"
              :disabled="!hasSelection"
              @click="handleBatchDelete"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:delete" />
              </template>
              批量删除
            </el-button>
            <el-button @click="refresh">
              <template #icon>
                <IconifyIconOffline icon="ep:refresh" />
              </template>
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

        <el-table-column prop="role_name" label="角色名称" min-width="120">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.role_name }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="display_name" label="显示名称" min-width="120" />

        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <span>{{ row.description || "-" }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="创建时间" min-width="160">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="updated_at" label="更新时间" min-width="160">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.updated_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-auth="'admin:roles:update'"
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
              v-auth="'admin:roles:permissions'"
              type="success"
              size="small"
              link
              @click="openPermissionDialog(row)"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:key" />
              </template>
              权限配置
            </el-button>
            <el-button
              v-auth="'admin:roles:delete'"
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
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        ref="formRef as any"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="角色名称" prop="role_name">
          <el-input
            v-model="formData.role_name"
            placeholder="请输入角色名称（英文标识）"
            :disabled="isEditing"
          />
        </el-form-item>

        <el-form-item label="显示名称" prop="display_name">
          <el-input
            v-model="formData.display_name"
            placeholder="请输入显示名称（中文名称）"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述（可选）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button
            type="primary"
            :loading="formLoading"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限配置"
      width="800px"
      :close-on-click-modal="false"
      @close="closePermissionDialog"
    >
      <div class="permission-config">
        <div class="role-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="角色名称">
              <el-tag type="primary">{{ currentRole?.role_name }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="显示名称">
              {{ currentRole?.display_name }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider>权限列表</el-divider>

        <div v-loading="permissionLoading" class="permission-tree">
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTreeData"
            :props="treeProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedPermissions"
            @check="handlePermissionCheck"
          >
            <template #default="{ data }">
              <div class="tree-node">
                <span class="node-label">{{ data.display_name }}</span>
                <span class="node-key">{{ data.permission_key }}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closePermissionDialog">取消</el-button>
          <el-button
            type="primary"
            :loading="permissionSaving"
            @click="saveRolePermissions"
          >
            保存权限
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import { ElMessage, ElTree, type FormRules } from "element-plus";
import { IconifyIconOffline } from "@/components/ReIcon";
import { useTable } from "@/composables/useTable";
import {
  getAdminRoles,
  createAdminRole,
  updateAdminRole,
  deleteAdminRole,
  getAdminRole,
  assignPermissionsToRole,
  getRolePermissions,
  updateRolePermissions,
  type AdminRole,
  type CreateAdminRoleRequest,
  type UpdateAdminRoleRequest,
  type AssignPermissionsToRolePayload
} from "@/api/system/roles";
import {
  getDefinedPermissions,
  type DefinedPermission
} from "@/api/system/permissions";
import { formatDateTime } from "@/utils/dateTime";

defineOptions({
  name: "AdminRoles"
});

// 搜索表单
const searchForm = reactive({
  search: ""
});

// 表单验证规则
const formRules: FormRules = {
  role_name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    {
      min: 2,
      max: 100,
      message: "角色名称长度在 2 到 100 个字符",
      trigger: "blur"
    }
  ],
  display_name: [
    { required: true, message: "请输入显示名称", trigger: "blur" },
    {
      min: 2,
      max: 100,
      message: "显示名称长度在 2 到 100 个字符",
      trigger: "blur"
    }
  ]
};

// 权限配置相关
const permissionDialogVisible = ref(false);
const permissionLoading = ref(false);
const permissionSaving = ref(false);
const currentRole = ref<AdminRole | null>(null);
const permissionTreeRef = ref<InstanceType<typeof ElTree>>();
const permissionTreeData = ref<any[]>([]);
const checkedPermissions = ref<number[]>([]);

// 树形控件配置
const treeProps = {
  children: "children",
  label: "display_name",
  disabled: "disabled"
};

// 使用表格组合式函数
const {
  // 响应式数据
  loading,
  tableData,
  selectedRows,
  searchValue,
  pagination,

  // 对话框相关
  dialogVisible,
  dialogTitle,
  dialogMode,
  currentRow,
  formRef,
  formData,
  formLoading,

  // 计算属性
  hasSelection,
  isEditing,

  // 方法
  fetchData,
  handleSearch,
  handleResetSearch,
  handlePageChange,
  handlePageSizeChange,
  handleSelectionChange,
  refresh,
  openCreateDialog,
  openEditDialog,
  closeDialog,
  handleSubmit,
  handleDelete,
  handleBatchDelete
} = useTable<AdminRole>({
  fetchApi: getAdminRoles,
  createApi: createAdminRole,
  updateApi: updateAdminRole,
  deleteApi: deleteAdminRole,
  tableConfig: {
    columns: [],
    showSelection: true,
    showIndex: true,
    stripe: true,
    border: true
  },
  searchConfig: {
    placeholder: "请输入角色名称或显示名称",
    searchKey: "search"
  },
  onSuccess: (action, data) => {
    console.log(`${action} 操作成功:`, data);
  },
  onError: (action, error) => {
    console.error(`${action} 操作失败:`, error);
  }
});

// 初始化表单数据
const initFormData = () => {
  return {
    role_name: "",
    display_name: "",
    description: ""
  };
};

// 重写打开创建对话框方法
const openCreateDialogWithInit = () => {
  openCreateDialog(initFormData());
};

// 保存原始方法的引用
const openCreateDialogOriginal = openCreateDialog;
// 使用新的方法名
const handleOpenCreateDialog = openCreateDialogWithInit;

// 打开权限配置对话框
const openPermissionDialog = async (role: AdminRole) => {
  currentRole.value = role;
  permissionDialogVisible.value = true;

  try {
    permissionLoading.value = true;

    // 获取所有权限定义
    const permissionsResponse = await getDefinedPermissions({
      page: 1,
      page_size: 1000
    });
    const allPermissions = permissionsResponse.data.items;

    // 获取角色当前权限
    const rolePermissionsResponse = await getRolePermissions(role.id);
    const rolePermissions = rolePermissionsResponse.data;

    // 构建权限树
    permissionTreeData.value = buildPermissionTree(allPermissions);

    // 设置已选中的权限
    checkedPermissions.value = rolePermissions.map(Number);

    // 等待DOM更新后设置选中状态
    await nextTick();
    if (permissionTreeRef.value) {
      permissionTreeRef.value.setCheckedKeys(checkedPermissions.value);
    }
  } catch (error) {
    console.error("获取权限数据失败:", error);
    ElMessage.error("获取权限数据失败");
  } finally {
    permissionLoading.value = false;
  }
};

// 构建权限树
const buildPermissionTree = (permissions: DefinedPermission[]) => {
  // 按分类分组
  const groupedByCategory = permissions.reduce(
    (acc, permission) => {
      const categoryId = permission.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(permission);
      return acc;
    },
    {} as Record<number, DefinedPermission[]>
  );

  // 构建树形结构
  const tree: any[] = [];

  Object.entries(groupedByCategory).forEach(([categoryId, perms]) => {
    const categoryNode = {
      id: `category_${categoryId}`,
      display_name: `分类 ${categoryId}`,
      permission_key: "",
      children: perms.map(perm => ({
        id: perm.id,
        display_name: perm.display_name,
        permission_key: perm.permission_key,
        category_id: perm.category_id
      }))
    };
    tree.push(categoryNode);
  });

  return tree;
};

// 关闭权限配置对话框
const closePermissionDialog = () => {
  permissionDialogVisible.value = false;
  currentRole.value = null;
  permissionTreeData.value = [];
  checkedPermissions.value = [];
};

// 处理权限选择
const handlePermissionCheck = (data: any, checked: any) => {
  // 这里可以添加权限选择的逻辑
  console.log("权限选择变化:", data, checked);
};

// 保存角色权限
const saveRolePermissions = async () => {
  if (!currentRole.value || !permissionTreeRef.value) return;

  try {
    permissionSaving.value = true;

    // 获取选中的权限ID（只获取叶子节点）
    const checkedKeys = permissionTreeRef.value.getCheckedKeys() as number[];
    const leafKeys = checkedKeys.filter(key => {
      return typeof key === "number" && !key.toString().startsWith("category_");
    });

    // 更新角色权限
    await updateRolePermissions(currentRole.value.id, {
      permission_ids: leafKeys.map(String)
    });

    ElMessage.success("权限配置保存成功");
    closePermissionDialog();
  } catch (error) {
    console.error("保存权限配置失败:", error);
    ElMessage.error("保存权限配置失败");
  } finally {
    permissionSaving.value = false;
  }
};
</script>

<style scoped>
.main {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}

.table-card {
  min-height: 600px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-actions {
  display: flex;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}

.permission-config {
  max-height: 500px;
}

.role-info {
  margin-bottom: 20px;
}

.permission-tree {
  max-height: 300px;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-label {
  font-weight: 500;
}

.node-key {
  padding: 2px 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  border-radius: 3px;
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

:deep(.el-tree-node__content) {
  height: 32px;
}
</style>
