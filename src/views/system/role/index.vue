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
              v-auth="'roles:create'"
              type="primary"
              @click="handleOpenCreateDialog"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:plus" />
              </template>
              新增角色
            </el-button>
            <el-button
              v-auth="'roles:delete'"
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
              v-auth="'roles:update'"
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
              v-auth="'roles:permissions'"
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
              v-auth="'roles:delete'"
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
        ref="formRef"
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
                <!-- 只有权限节点才显示权限标识 -->
                <span v-if="data.type === 'permission'" class="node-key">{{
                  data.permission_key
                }}</span>
                <!-- 分类节点显示不同的样式 -->
                <span v-else-if="data.type === 'category'" class="node-category"
                  >分类</span
                >
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
  assignPermissionKeysToRole,
  type AdminRole,
  type CreateAdminRoleRequest,
  type UpdateAdminRoleRequest,
  type AssignPermissionsToRolePayload,
  type AssignPermissionKeysToRolePayload
} from "@/api/system/roles";
import {
  getDefinedPermissions,
  getPermissionTree,
  getPermissionCategories,
  type DefinedPermission,
  type PermissionTreeItem,
  type PermissionCategory,
  type PermissionCategoryNode
} from "@/api/system/permissions";
import { getRolePermissionKeys } from "@/api/system/roles";
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
const permissionTreeData = ref<PermissionTreeItem[]>([]);
const checkedPermissions = ref<string[]>([]);
const checkedPermissionKeys = ref<string[]>([]);

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

// 转换权限分类节点为树形结构（基于最新API文档）
const convertCategoryNodesToTree = (
  nodes: PermissionCategoryNode[]
): PermissionTreeItem[] => {
  const result: PermissionTreeItem[] = [];

  const processNode = (node: PermissionCategoryNode): PermissionTreeItem => {
    // 创建分类节点
    const treeItem: PermissionTreeItem = {
      id: `category_${node.category_id}`,
      display_name:
        node.category_name ||
        `分类-${node.category_id?.slice(0, 8) || "unknown"}`,
      type: "category",
      children: []
    };

    // 添加权限项作为子节点
    if (node.permissions && node.permissions.length > 0) {
      const permissionNodes = node.permissions.map(permission => ({
        id: permission.id,
        permission_key: permission.permission_key,
        display_name: permission.display_name,
        type: "permission" as const,
        children: undefined
      }));
      treeItem.children!.push(...permissionNodes);
    }

    // 递归处理子分类
    if (node.children_categories && node.children_categories.length > 0) {
      const childCategories = node.children_categories.map(processNode);
      treeItem.children!.push(...childCategories);
    }

    return treeItem;
  };

  return nodes.map(processNode);
};

// 打开权限配置对话框（基于最新API文档）
const openPermissionDialog = async (role: AdminRole) => {
  currentRole.value = role;
  permissionDialogVisible.value = true;

  try {
    permissionLoading.value = true;

    // 获取权限树数据（基于最新API文档）
    const permissionTreeResponse = await getPermissionTree();
    const categoryNodes = permissionTreeResponse.data.tree;

    // 转换为前端树组件需要的格式
    permissionTreeData.value = convertCategoryNodesToTree(categoryNodes);

    // 获取角色当前权限键（使用新API）
    const rolePermissionKeysResponse = await getRolePermissionKeys(role.id);
    const permissionKeys = rolePermissionKeysResponse.data;
    checkedPermissionKeys.value = permissionKeys;

    // 设置已选中的权限（使用节点ID）
    const checkedNodeIds = getNodeIdsByPermissionKeys(
      permissionTreeData.value,
      permissionKeys
    );
    checkedPermissions.value = checkedNodeIds;

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

// 根据权限key获取节点ID（更新为支持新的树结构）
const getNodeIdsByPermissionKeys = (
  tree: PermissionTreeItem[],
  permissionKeys: string[]
): string[] => {
  const result: string[] = [];

  // 递归遍历树结构
  const traverse = (nodes: PermissionTreeItem[]) => {
    if (!nodes) return;

    for (const node of nodes) {
      // 如果是权限节点且权限key在选中列表中
      if (
        node.type === "permission" &&
        node.permission_key &&
        permissionKeys.includes(node.permission_key)
      ) {
        result.push(node.id);
      }

      // 递归处理子节点
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(tree);
  return result;
};

// 关闭权限配置对话框
const closePermissionDialog = () => {
  permissionDialogVisible.value = false;
  currentRole.value = null;
  permissionTreeData.value = [];
  checkedPermissions.value = [];
  checkedPermissionKeys.value = [];
};

// 处理权限选择
const handlePermissionCheck = (data: PermissionTreeItem, checked: any) => {
  // 记录选择变化，可以在这里添加额外逻辑
  console.log("权限选择变化:", data, checked);
};

// 获取所有选中节点的permission_key（更新为支持新的树结构）
const getCheckedPermissionKeys = (
  tree: PermissionTreeItem[],
  checkedNodeIds: string[]
): string[] => {
  const permissionKeys: string[] = [];

  // 递归遍历树结构
  const traverse = (nodes: PermissionTreeItem[]) => {
    if (!nodes) return;

    for (const node of nodes) {
      // 如果是权限节点且在选中列表中
      if (
        node.type === "permission" &&
        node.permission_key &&
        checkedNodeIds.includes(node.id)
      ) {
        permissionKeys.push(node.permission_key);
      }

      // 递归处理子节点
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(tree);
  return permissionKeys;
};

// 保存角色权限
const saveRolePermissions = async () => {
  if (!currentRole.value || !permissionTreeRef.value) return;

  try {
    permissionSaving.value = true;

    // 获取选中的节点ID（只获取权限节点，过滤掉分类节点）
    const checkedNodeIds = permissionTreeRef.value.getCheckedKeys() as string[];
    const permissionNodeIds = checkedNodeIds.filter(id => {
      // 过滤掉分类节点（以category_开头的节点）
      return typeof id === "string" && !id.toString().startsWith("category_");
    });

    // 获取选中节点的permission_key
    const selectedPermissionKeys = getCheckedPermissionKeys(
      permissionTreeData.value,
      permissionNodeIds
    );

    // 使用新的API提交权限keys
    await assignPermissionKeysToRole(currentRole.value.id, {
      permission_keys: selectedPermissionKeys
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

.node-category {
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
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
