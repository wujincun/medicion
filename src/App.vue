<template>
    <div class="common-layout">
        <el-container>
            <el-aside>
                <el-menu :default-active="active" class="el-menu-vertical-demo">
                    <RouterLink to="/filter">
                        <el-menu-item index="0"> 查询药品 </el-menu-item>
                    </RouterLink>
                    <RouterLink to="/add">
                        <el-menu-item index="1"> 新增药品 </el-menu-item>
                    </RouterLink>
                </el-menu>
            </el-aside>
            <el-main>
                <RouterView />
            </el-main>
        </el-container>
    </div>
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
const active = ref('');
const route = useRoute();
watch(
    () => route.fullPath,
    value => {
        if (value == '/filter') {
            active.value = 0;
        } else if ((value = '/add')) {
            active.value = 1;
        }
    }
);
</script>
<style>
.el-menu-vertical-demo {
    height: 100%;
}
</style>
