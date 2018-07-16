import axios from '~/plugins/axios'
import Vuex from 'vuex'

const store = () => new Vuex.Store({
  state: {
    authUser: null,
    userProfile: null,
    userLists: null,
    userFriendIds: null,
    userFollowersIds: null
  },

  mutations: {
    setUser: function (state, user) {
      state.authUser = user
    },
    setUserProfile: function (state, payload) {
      state.userProfile = payload
    },
    setUserLists: function (state, payload) {
      state.userLists = payload
    },
    setUserFriendIds: function (state, payload) {
      state.userFriendIds = payload
    },
    setUserFollowersIds: function (state, payload) {
      state.userFollowersIds = payload
    }
  },

  actions: {
    // nuxtServerInit is called by Nuxt.js before server-rendering every page
    nuxtServerInit ({ commit }, { req }) {
      if (req.session && req.session.user_profile) {
        commit('setUser', req.session.user_profile)
      }
    },

    async fetchUserProfile ({ commit }) {
      const { data } = await axios.get('/api/twitter/account/verify_credentials')
      const profile = {
        id: data.id,
        name: data.name,
        screen_name: data.screen_name,
        profile_image_url_https: data.profile_image_url_https
      }
      commit('setUserProfile', profile)
    },

    async fetchUserLists ({ commit, state }) {
      const { data } = await axios.get('/api/twitter/lists/list', {
        params: {
          user_id: state.authUser.user_id
        }
      })
      const lists = data.map(x => { return {
        id: x.id,
        owner_id: x.user.id,
        slug: x.slug,
        full_name: x.full_name,
        member_count: x.member_count
      } })
      commit('setUserLists', lists)
    },

    async fetchUserFriendIds ({ commit, state }) {
      const params = {
        user_id: state.authUser.user_id,
        count: 5000,
        skip_status: true,
        include_user_entities: false
      }
      const { data } = await axios.get('/api/twitter/followers/ids', { params })
      commit('setUserFriendIds', data)
    },

    async fetchUserFollowersIds ({ commit, state }) {
      const params = {
        user_id: state.authUser.user_id,
        count: 5000,
        skip_status: true,
        include_user_entities: false
      }
      const { data } = await axios.get('/api/twitter/friends/ids', { params })
      commit('setUserFollowersIds', data)
    },

    async logout ({ commit }) {
      await axios.post('/api/logout')
      commit('setUser', null)
    }
  },

  getters: {
    userName: state => {
      return state.userProfile ? state.userProfile.name : ''
    },
    userScreenName: state => {
      return state.userProfile ? state.userProfile.screen_name : ''
    },
    userProfileImageUrl: state => {
      return state.userProfile ? state.userProfile.profile_image_url_https : ''
    }
  }

})
export default store
