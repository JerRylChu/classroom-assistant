import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import store from '../store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(VueRouter);
Vue.use(Antd);

const routes = [
  {
    path: '/',
    name: 'articleStream',
    component: () => import('../views/ArticleStream'),
    meta: {
      title: '社区首页'
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: "/layout",
    name: "layout",
    redirect: "/homepage",
    component: () => import("../views/Layout.vue"),
    meta: {
      title: '个人中心'
    },
    children:[
      // {
      //   path: "/table",
      //   name: 'TimeTable',
      //   component: () => import("../views/menu/TimeTable")
      // },
      {
        path: '/articles',
        name: 'ArticleStream',
        component: () => import("../views/menu/RecommendArticle"),
      },
      {
        path: "/note",
        name: 'note',
        component: () => import("../views/menu/LearnNote")
      },
      {
        path: '/add',
        name: 'add',
        component: () => import("../views/menu/RichTextEditor")
      },
      // {
      //   path: '/photos',
      //   name: 'photos',
      //   component: () => import("../views/menu/PhotoStore")
      // },
      // {
      //   path: '/todo',
      //   name: 'todo',
      //   component: () => import("../views/menu/ToDoList")
      // },
      {
        path: '/homepage',
        name: 'homepage',
        component: () => import("../views/menu/HomePage")
      },
      {
        path: '/collect',
        name: 'collect',
        component: () => import("../views/menu/CollectArticle")
      },
      {
        path: '/care',
        name: 'care',
        component: () => import("../views/menu/CareAuthor")
      },
      {
        path: "/404",
        name: "noteFound",
        component: ()=>import("../components/NotFound")
      }
    ]
  },
  {
    path: "/articleDetail",
    name: "articleDetail",
    component: ()=>import("../components/ArticleDetail"),
    meta: {
      title: '文章详情'
    }
  },
  {
    path: "/authorDetail",
    name: "authorDetail",
    component: ()=>import("../components/HomeArticle"),
    meta: {
      title: '作者详情'
    }
  },
  {
    path: "/404",
    name: "noteFound",
    component: ()=>import("../components/NotFound"),
    meta: {
      title: '404 not found'
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(function (to, from ,next){
  if(to.matched.length === 0){
    next({path:'/404'})
  }
  if(to.path === '/' || to.path === '/login' || to.path === '/articleDetail' || to.path === '/authorDetail'){
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next();
  }else {
    if(store.state.user.id === 0){
      if (to.meta.title) {
        document.title = to.meta.title
      }
      next({path:'/'});
    }else {
      if (to.meta.title) {
        document.title = to.meta.title
      }
      next();
    }
  }

})

export default router;
