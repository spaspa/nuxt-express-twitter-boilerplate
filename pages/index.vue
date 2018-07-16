<template lang="pug">
  section.container
    button.authButton(v-if="!authUser" @click="login")
      | Log in to Twitter
    div(v-else)
      div.message(v-if="userProfile")
        | Logged in as @{{ userScreenName }}
      img.profileImage(:src="userProfileImageUrl")
</template>

<script>
import axios from '~/plugins/axios'
import { mapState, mapGetters } from 'vuex'

export default {
  async asyncData () {
    let { data } = await axios.get('/api/users')
    return { users: data }
  },
  head () {
    return {
      title: 'Users'
    }
  },
  async mounted () {
    if (this.$store.state.authUser) {
      await this.$store.dispatch('fetchUserProfile')
      await this.$store.dispatch('fetchUserLists')
    }
  },
  computed: {
    userProfileImageUrl () {
      return this.userProfile ? this.userProfile.profile_image_url_https : ''
    },
    ...mapState([
      'authUser',
      'userProfile',
      'userLists',
      'userFriendIds',
      'userFollowersIds'
    ]),
    ...mapGetters([
      'userName',
      'userScreenName',
      'userProfileImageUrl'
    ])
  },
  methods: {
    login () {
      location.href = '/api/auth'
    },
    async fetch () {
      await this.$store.dispatch('fetchUserFriends')
      await this.$store.dispatch('fetchUserFollowers')
    },
    async logout () {
      await this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="sass" scoped>
.title
  margin: 30px 0
.profileImage
  border-radius: 50%
.message
  font-family: "Avenir Sans-serif"
  margin-bottom: 1rem
  color: #333333

@mixin disable-button-styling
  border: none
  cursor: pointer
  outline: none
  padding: 0
  appearance: none
  text-decoration: none

.authButton
  @include disable-button-styling
  width: 12rem
  height: 4rem
  font-size: 1.1rem
  text-align: center
  text-decoration: none
  border-radius: 3px
  border: solid 1px #00aced
  background: #ffffff
  color: #00aced
  transition: all 0.2s ease

  &:hover
    background: #00aced
    color: #ffffff
</style>
