<template>
    <div class="searchWrap">
        <el-input v-model="state.searchVal" placeholder="请输入查询药品名称" @keyup.enter.native="handleSearch"> </el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
    </div>
    <el-table class="resTable" :data="state.tableData" style="width: 100%">
        <el-table-column prop="name" label="药品名称" />
        <el-table-column prop="position" label="药品区域" />
        <el-table-column prop="layer" label="展柜层级" />
        <el-table-column prop="factory" label="药品厂家" />

        <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="handlEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup lang="ts">
interface User {
    id: string;
    name: string;
    factory: string;
    position: string;
    layer: string;
}

import { reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const state = reactive({
    allData: JSON.parse(localStorage.getItem('data') || '[]'),
    searchVal: '',
    tableData: [],
    dialogFormVisible: false
});
const handleSearch = () => {
    const searchData = state.allData.filter(item => {
        return state.searchVal ? item.name.indexOf(state.searchVal) > -1 : false;
    });
    state.tableData = searchData;
};
const handleDelete = (index: number, row: User) => {
    ElMessageBox.confirm(`确定要删除药名：${row.name}，厂家：${row.factory}，位置：${row.position}的这条记录?`, '删除记录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    })
        .then(() => {
            const newAllData = state.allData.filter(item => item.id != row.id);
            state.allData = newAllData;
            state.tableData = state.tableData.filter(item => item.id != row.id);
            localStorage.setItem('data', JSON.stringify(newAllData));
            ElMessage.success('删除成功');
        })
        .catch(() => {
            console.log('删除失败');
        });
};
const handlEdit = (index: number, row) => {
    router.push({ name: 'add', query: { data: JSON.stringify(row) }, params: { data: row } });
};
</script>
<style>
.resTable {
    margin-top: 30px;
}
.searchWrap {
    display: flex;
}
</style>
