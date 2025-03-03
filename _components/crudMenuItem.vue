<template>
  <master-modal
      v-model="show"
      :title="title"
      custom-position
      :actions="actions"
      @hide="resetData"
  >
    <div class="box relative-position">
      <!-- btn create new menu item -->
      <div class="row justify-end">
        <q-btn
            color="green"
            class="q-ml-xs q-mb-sm text-cente text-capitalize"
            unelevated
            rounded outline
            @click="$refs.crudMenuItems.create()"
        >
          <q-icon name="fas fa-plus-circle" class="q-mr-sm" size="16px"/>
          {{ this.$tr('menu.cms.newItem') }}
        </q-btn>
      </div>
      <!-- crud template -->
      <crud
          :crud-data="import('@imagina/qmenu/_crud/menuItems')"
          type="onlyUpdate"
          ref="crudMenuItems"
          @created="getItems(true)"
          @updated="getItems(true)"
          @deleted="getItems(true)"
          :custom-data="customMenuItem"
      />
      <!-- dragable -->
      <div class="col-12 q-mt-sm">
        <nestedMenuItems :items="menuItems"/>
      </div>
      <inner-loading :visible="loading"/>
    </div>
  </master-modal>
</template>

<script>
import nestedMenuItems from '@imagina/qsite/_components/master/recursiveItemDraggable'

export default {
  name: "crudMenuItems",
  components: {
    nestedMenuItems,
  },
  mounted() {
    this.$nextTick(() => {
      this.$root.$on('updateMenuItems', this.handlerUpdateMenuItems)
    })
  },
  data() {
    return {
      deleteApi: 'apiRoutes.qmenu.menuItems',
      title: '-',
      loading: false,
      menuId: null,
      show: false,
      menuItems: [],
      actions: [{
        action: () => this.updateOrder(),
        props: {
          label: this.$tr('isite.cms.label.save'),
          color: 'green'
        }
      }]
    }
  },
  computed: {
    customMenuItem() {
      return {
        getDataForm: (data) => {
          return new Promise((resolve, reject) => {
            data.menuId = this.menuId
            resolve(data)
          })
        },
        formRight: {
          parentId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('isite.cms.form.parent'),
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmenu.menuItems',
              refresh: true,
              requestParams: {
                filter: {allTranslations: true, menu: this.menuId}
              }
            }
          },
        }
      }
    }
  },
  methods: {
    openModal({show, title, menuId}) {
      this.show = show
      this.title = title
      this.menuId = menuId
      this.getItems(true)
    },
    getItems(refresh = false) {
      this.loading = true
      let menuId = this.menuId
      let params = {
        refresh: refresh,
        params: {include: 'menuitems'},
      }
      this.$crud.show('apiRoutes.qmenu.menus', menuId, params).then(({data}) => {
        const menuitems = this.setActions(data.menuitems)
        menuitems.sort((a, b) => a.position - b.position)
        this.menuItems = this.arrayToTree(menuitems)
        this.loading = false
      }).catch(error => {
        this.$apiResponse.handleError(error, () => {
          this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
          this.loading = false
        })
      })
    },
    setActions(menu) {
      return menu.map((item) => {
        item = {
          ...item,
          actions: [
            {
              name: 'edit',
              icon: 'fas fa-pen',
              label: this.$tr('isite.cms.label.edit'),
              action: () => this.$refs.crudMenuItems.update(item)
            },
            {
              name: 'delete',
              icon: 'fas fa-trash-alt',
              label: this.$tr('isite.cms.label.delete'),
              action: () => this.$refs.crudMenuItems.delete(item)
            }
          ]
        }
        return item
      })
    },
    updateOrder() {
      let newdata = []
      this.treeToArray(this.menuItems, newdata)
      this.loading = true
      this.$crud.create('apiRoutes.qmenu.menuItemsOrdener', {menuitems: newdata})
          .then(response => {
            this.loading = false
            this.show = false
            this.getItems()
            this.$alert.info({message: `${this.$tr('isite.cms.message.recordUpdated')}`})
          })
          .catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('isite.cms.message.errorRequest')})
          })
    },
    arrayToTree(elements, parentId = 0) {
      return elements.filter(element => {
        if (element.parentId == parentId) {
          return element['children'] = this.arrayToTree(elements, element.id)
        }
      })
    },
    treeToArray(items, response, parentId = null) {
      let elements = [...items]
      elements.forEach((element, index) => {
        element.position = index
        element.parentId = parentId
        response.push(element)
        if (element.children.length) this.treeToArray(element.children, response, element.id)
      })
    },
    handlerUpdateMenuItems(event) {
      this.getItems()
    },
    //Reset the component data when modal was closed
    resetData() {
      this.title = null
      this.menuId = null
      this.menuItems = []
    }
  }
}
</script>
