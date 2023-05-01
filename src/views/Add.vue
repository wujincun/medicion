<template>
    <div class="add">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="120px">
            <el-form-item label="药品名称" prop="name">
                <el-autocomplete
                    v-model="form.name"
                    :fetch-suggestions="(queryString, cb) => querySearch(queryString, cb, drugNameList)"
                    clearable
                    placeholder="请输入查询药品名称"
                />
            </el-form-item>
            <el-form-item label="药品厂家" prop="factory">
                <el-autocomplete
                    v-model="form.factory"
                    :fetch-suggestions="(queryString, cb) => querySearch(queryString, cb, drugFactoryList)"
                    clearable
                    placeholder="请输入药品厂家"
                />
            </el-form-item>
            <el-form-item label="药品区域" prop="position">
                <el-autocomplete
                    v-model="form.position"
                    :fetch-suggestions="(queryString, cb) => querySearch(queryString, cb, drugPositionList)"
                    clearable
                    placeholder="请输入药品区域"
                />
            </el-form-item>
            <el-form-item label="展柜层级" prop="layer">
                <el-select v-model="form.layer" placeholder="请输入展柜层级">
                    <el-option v-for="i in 6" :key="i" :label="`第${i}层`" :value="i" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-if="form.id" @click="submitForm(ruleFormRef)">编辑</el-button>
                <el-button type="primary" v-else @click="submitForm(ruleFormRef)">添加</el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { getUuid } from '../utils/index';
import { useRoute } from 'vue-router';
const route = useRoute();
const detailData = JSON.parse(route?.query?.data || '{}');

const emit = defineEmits(['added']);
const allData = JSON.parse(localStorage.getItem('data') || '[]');
const drugNameList = JSON.parse(localStorage.getItem('drugNameList') || '[]');
const drugFactoryList = JSON.parse(localStorage.getItem('drugFactoryList') || '[]');
const drugPositionList = JSON.parse(localStorage.getItem('drugPositionList') || '[]');
const ruleFormRef = ref<FormInstance>();
const { id, name, factory, position, layer } = detailData as any;
const form = reactive({
    id: id || '',
    name: name || '',
    factory: factory || '',
    position: position || '',
    layer: layer || ''
});

const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入药品名称', trigger: 'change' }],
    factory: [{ required: true, message: '请输入药品厂家', trigger: 'change' }],
    position: [{ required: true, message: '请输入药品区域', trigger: 'change' }],
    layer: [{ required: true, message: '请选择展柜层级', trigger: 'change' }]
});
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            let newAllData: any = [];
            // 查重
            if (form.id) {
                newAllData = allData.map(item => {
                    if (item.id == form.id) {
                        console.log('1111', form, item);
                        item = { ...form };
                    }
                    return item;
                });
                // 修改
            } else {
                // 添加
                newAllData = [
                    ...allData,
                    {
                        ...form,
                        id: getUuid()
                    }
                ];
            }
            // if (!isExist) {
            // 添加
            //     allData.push({
            //         ...form,
            //         id: getUuid()
            //     });
            // }
            localStorage.setItem('data', JSON.stringify(newAllData));
            saveToStorage(drugNameList, 'drugNameList', form.name);
            saveToStorage(drugFactoryList, 'drugFactoryList', form.factory);
            saveToStorage(drugPositionList, 'drugPositionList', form.position);
            emit('added');

            ElMessage.success('添加成功');
            formEl.resetFields();
            console.log('submit!', form);
        } else {
            console.log('error submit!', fields);
        }
    });
};

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};

const querySearch = (queryString: string, cb: any, list: string[]) => {
    const results = queryString ? list.filter(item => item.indexOf(queryString) > -1) : list;
    const res = results.map(item => ({ value: item }));
    cb(res);
};

function saveToStorage(list, key, value) {
    !list.includes(value) && list.push(value);
    localStorage.setItem(key, JSON.stringify(list));
}
</script>
<style scope>
.el-select,
.el-autocomplete {
    width: 100%;
}
</style>
