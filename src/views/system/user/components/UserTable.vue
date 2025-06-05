<template>
  <div class="user-table">
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="#" width="60" align="center" />
      <el-table-column prop="username" label="用户名" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
      <el-table-column prop="full_name" label="姓名" min-width="120">
        <template #default="{ row }">
          <span>{{ row.full_name || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="department_name" label="部门" min-width="120">
        <template #default="{ row }">
          <span>{{ row.department_name || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_active" label="状态" width="100" align="center">
        <template #default="{ row, $index }">
          <el-switch
            v-model="row.is_active"
            :loading="switchLoadMap[$index]?.loading"
            @change="() => handleStatusChange(row, $index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="mfa_enabled"
        label="双因子"
        width="100"
        align="center"
      >
        <template #default="{ row }">
          <el-tag :type="row.mfa_enabled ? 'success' : 'info'">
            {{ row.mfa_enabled ? "已启用" : "未启用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="last_login_at"
        label="最后登录时间"
        min-width="180"
      >
        <template #default="{ row }">
          <span>{{
            row.last_login_at ? formatDateTime(row.last_login_at) : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" min-width="180">
        <template #default="{ row }">
          <span>{{ formatDateTime(row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            size="small"
            :icon="Edit"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            link
            size="small"
            :icon="Key"
            @click="handleResetPassword(row)"
          >
            重置密码
          </el-button>
          <el-button
            type="primary"
            link
            size="small"
            :icon="UserIcon"
            @click="handleAssignRoles(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="danger"
            link
            size="small"
            :icon="Delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Delete, Key, User as UserIcon } from "@element-plus/icons-vue";
import { type AdminUser } from "@/api/system/users";
import type { PaginationConfig } from "@/composables/useTable";

defineOptions({
  name: "UserTable"
});

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tableData: {
    type: Array as () => AdminUser[],
    default: () => []
  },
  pagination: {
    type: Object as () => PaginationConfig,
    required: true
  },
  switchLoadMap: {
    type: Object as () => Record<number, { loading: boolean }>,
    default: () => ({})
  },
  formatDateTime: {
    type: Function,
    required: true
  }
});

const emit = defineEmits([
  "selection-change",
  "page-change",
  "page-size-change",
  "edit",
  "reset-password",
  "delete",
  "status-change",
  "assign-roles"
]);

// 表格选择项变化
const handleSelectionChange = (selection: AdminUser[]) => {
  emit("selection-change", selection);
};

// 页码变化
const handleCurrentChange = (current: number) => {
  emit("page-change", current);
};

// 每页条数变化
const handleSizeChange = (size: number) => {
  emit("page-size-change", size);
};

// 编辑用户
const handleEdit = (row: AdminUser) => {
  emit("edit", row);
};

// 重置密码
const handleResetPassword = (row: AdminUser) => {
  emit("reset-password", row);
};

// 删除用户
const handleDelete = (row: AdminUser) => {
  emit("delete", row);
};

// 分配角色
const handleAssignRoles = (row: AdminUser) => {
  emit("assign-roles", row);
};

// 状态变更
const handleStatusChange = (row: AdminUser, index: number) => {
  emit("status-change", row, index);
};
</script>

<style scoped>
.user-table {
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
