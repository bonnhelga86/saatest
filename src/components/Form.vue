<script lang="ts" setup>
import { ref } from 'vue';
import { Delete, Plus, QuestionFilled } from '@element-plus/icons-vue';
import type { FormInstance, TableColumnCtx  } from 'element-plus';
import { useAccountStore } from '../stores/account';
import type { Person } from '../stores/account';

interface SpanMethodProps {
  row: Person
  column: TableColumnCtx<Person>
  rowIndex: number
  columnIndex: number
}

const { formModel, add, remove, update } = useAccountStore();

const checkType = ({
  row,
  columnIndex,
}: SpanMethodProps) => {
  if (columnIndex === 2 && row.type == 'ldap') {
    return { colspan: 2, rowspan: 1 }
  } else if (columnIndex === 3 && row.type == 'ldap') {
    return { colspan: 0, rowspan: 0 }
  }
}

const formRef = ref<FormInstance>();

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      sendOut();
    } else {
      console.log('error submit!', fields);
    }
  })
}

const sendOut = () => {
  console.log(update());
}
</script>

<template>
  <el-text size="large" tag="b">Учетные записи</el-text>
  <el-button class="mt-4" :icon="Plus"  @click="add"/>
  <el-alert
    description="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
    type="info"
    show-icon
    :closable="false"
    class="my-4"
  >
    <template #icon>  
      <QuestionFilled />  
    </template> 
  </el-alert>

  <el-form
    ref="formRef"
    style="max-width: 1280px"
    :model="formModel"
  >
    <el-table
      :data="formModel"
      :span-method="checkType"
      >
      <el-table-column label="Метки" width="290">
        <template #default="{$index}">
          <el-form-item
            :prop="`${$index}.tags`"
            :rules="{
              max: 50,
              message: 'Длина не может превышать 50 символов',
              trigger: ['blur', 'change'],
            }"
            >
            <el-input
              v-model="formModel[$index].tags"
            />
          </el-form-item> 
        </template>
      </el-table-column>
      <el-table-column label="Тип записи" width="290">
        <template #default="{$index}">
          <el-form-item prop="type">
            <el-select
              v-model="formModel[$index].type"
            >
              <el-option label="Локальная" value="local" />
              <el-option label="LDAP" value="ldap" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Логин" width="290">
        <template #default="{$index}">
          <el-form-item
            :prop="`${$index}.login`"
            :rules="[
              {
                required: true,
                message: 'Поле обязательно к заполнению',
                trigger: ['blur', 'change']
              },
              {
                max: 100,
                message: 'Длина не может превышать 100 символов',
                trigger: ['blur', 'change']
              }
            ]"
            >
            <el-input
              v-model="formModel[$index].login"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Пароль" width="290">
        <template #default="{$index}">
          <el-form-item
            :prop="`${$index}.password`"
            :rules="[
              {
                required: formModel[$index].type==='local',
                message: 'Поле обязательно к заполнению',
                trigger: ['blur', 'change']
              },
              {
                max: 100,
                message: 'Длина не может превышать 100 символов',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input
              v-model="formModel[$index].password"
              type="password"
              show-password
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="">
        <el-button :icon="Delete" @click="remove"/>
      </el-table-column>
    </el-table>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">Сохранить</el-button>
    </el-form-item>
  </el-form>
</template>

<style>
b.el-text {
  margin-right: 20px;
}

div.el-alert {
  margin: 20px 0;
}

.el-table td.el-table__cell {
  vertical-align: top;
}
</style>