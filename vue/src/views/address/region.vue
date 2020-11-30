<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.region_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/address/region";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "id",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入id",
                trigger: "blur"
              }]
            },
            {
              label: "地址编码",
              prop: "dzbm",
              rules: [{
                required: true,
                message: "请输入地址编码",
                trigger: "blur"
              }]
            },
            {
              label: "行政区划代码",
              prop: "xzqhdm",
              rules: [{
                required: true,
                message: "请输入行政区划代码",
                trigger: "blur"
              }]
            },
            {
              label: "行政区划名称",
              prop: "xzqhmc",
              rules: [{
                required: true,
                message: "请输入行政区划名称",
                trigger: "blur"
              }]
            },
            {
              label: "上级行政区划_地址编码",
              prop: "sjxzqyDzbm",
              rules: [{
                required: true,
                message: "请输入上级行政区划_地址编码",
                trigger: "blur"
              }]
            },
            {
              label: "设立日期",
              prop: "slrq",
              rules: [{
                required: true,
                message: "请输入设立日期",
                trigger: "blur"
              }]
            },
            {
              label: "撤销日期",
              prop: "cxsj",
              rules: [{
                required: true,
                message: "请输入撤销日期",
                trigger: "blur"
              }]
            },
            {
              label: "更新时间",
              prop: "gxsj",
              rules: [{
                required: true,
                message: "请输入更新时间",
                trigger: "blur"
              }]
            },
            {
              label: "启用日期",
              prop: "qyrq",
              rules: [{
                required: true,
                message: "请输入启用日期",
                trigger: "blur"
              }]
            },
            {
              label: "停用日期",
              prop: "tyrq",
              rules: [{
                required: true,
                message: "请输入停用日期",
                trigger: "blur"
              }]
            },
            {
              label: "排序",
              prop: "sort",
              rules: [{
                required: true,
                message: "请输入排序",
                trigger: "blur"
              }]
            },
            {
              label: "撤销标识(1-未撤销，2-撤销)",
              prop: "status",
              rules: [{
                required: true,
                message: "请输入撤销标识(1-未撤销，2-撤销)",
                trigger: "blur"
              }]
            },
            {
              label: "地址元素类型",
              prop: "dzyslxdm",
              rules: [{
                required: true,
                message: "请输入地址元素类型",
                trigger: "blur"
              }]
            },
            {
              label: "别名简称",
              prop: "bmjc",
              rules: [{
                required: true,
                message: "请输入别名简称",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.region_add, false),
          viewBtn: this.vaildData(this.permission.region_view, false),
          delBtn: this.vaildData(this.permission.region_delete, false),
          editBtn: this.vaildData(this.permission.region_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          window.console.log(error);
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
