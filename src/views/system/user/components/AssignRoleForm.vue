<template>
  <el-dialog
    :title="`为 ${currentAssignUser?.username} 分配角色`"
    :model-value="visible"
    width="500px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" label-width="80px">
      <el-form-item label="角色" prop="role_names">
        <el-select
          v-model="formData.role_names"
          multiple
          filterable
          placeholder="请选择角色"
          style="width: 100%"
          :loading="loadingRoles"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.role_name"
            :label="item.display_name"
            :value="item.role_name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { AdminUser } from "@/api/system/users";
import { getAdminRoles } from "@/api/system/roles";
import { assignRolesToUser, getUserRoles } from "@/api/system/users"; // 假设API已更新或存在

defineOptions({
  name: "AssignRoleForm"
});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentAssignUser: {
    type: Object as () => AdminUser | null,
    default: null
  }
});

const emit = defineEmits(["update:visible", "close", "submit"]);

const formRef = ref<FormInstance>();
const formData = ref<{ role_names: string[] }>({ role_names: [] });
const roleOptions = ref<{ role_name: string; display_name: string }[]>([]);
const loadingRoles = ref(false);
const submitLoading = ref(false);

// 获取角色列表
const fetchRoles = async () => {
  loadingRoles.value = true;
  try {
    const res = await getAdminRoles({ page_size: 999 }); // 获取所有角色用于选择
    if (res.success && res.data && res.data.items) {
      roleOptions.value = res.data.items.map(role => ({
        role_name: role.role_name, // 使用角色名称
        display_name: role.display_name // 使用角色的显示名称
      }));
    }
  } catch (error) {
    console.error("获取角色列表失败:", error);
    ElMessage.error("获取角色列表失败");
  }
  loadingRoles.value = false;
};

// 获取用户当前的角色
const fetchUserRoles = async () => {
  if (props.currentAssignUser?.id) {
    try {
      const res = await getUserRoles(props.currentAssignUser.id);
      if (res.success && res.data && res.data.roles) {
        formData.value.role_names = res.data.roles; // API返回role_name数组
      } else {
        formData.value.role_names = [];
      }
    } catch (error) {
      console.error("获取用户角色失败:", error);
      ElMessage.error("获取用户角色失败");
      formData.value.role_names = [];
    }
  }
};

watch(
  () => props.visible,
  async newVal => {
    if (newVal) {
      await fetchRoles();
      await fetchUserRoles();
      // 重置表单校验
      formRef.value?.clearValidate();
    } else {
      formData.value.role_names = [];
    }
  }
);

onMounted(() => {
  if (props.visible) {
    fetchRoles();
    fetchUserRoles();
  }
});

const handleClose = () => {
  emit("update:visible", false);
  emit("close");
};

const handleSubmit = async () => {
  if (!props.currentAssignUser?.id) {
    ElMessage.error("未选择用户");
    return;
  }
  submitLoading.value = true;
  try {
    await assignRolesToUser(props.currentAssignUser.id, {
      role_names: formData.value.role_names
    });
    ElMessage.success("分配角色成功");
    emit("submit");
    handleClose();
  } catch (error) {
    console.error("分配角色失败:", error);
    ElMessage.error("分配角色失败");
  }
  submitLoading.value = false;
};
</script>
