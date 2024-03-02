import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: sessionStorage.getItem('state')? JSON.parse(sessionStorage.getItem('state')):{
        user:{
            id: 0,
            nickName: '',
            headIconUrl: '',
            school: '',
            phoneNumber: '',
            signature: '',
            sex: 0,
            majorName: '',
        }
    },
    mutations:{
        changeState(state,n){
            state.user = n;
            sessionStorage.setItem('state', JSON.stringify(store.state))
        },
        changeHeadIconUrl(state,n){
            state.user.headIconUrl = n;
        }
    },
    actions:{

    }
})

export default store
