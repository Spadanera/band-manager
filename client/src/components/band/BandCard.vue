<template>
  <v-card>
    <v-expand-transition>
      <div
        v-show="
          setlistOpen === undefined ||
          $vuetify.breakpoint.xs ||
          !memberInfo.publicUser
        "
      >
        <div>
          <v-subheader>{{ formatted_address }}</v-subheader>
          <v-card-title style="padding-top: 0" class="headline">{{
            band.name
          }}</v-card-title>
          <v-card-subtitle class="text-capitalize"
            >{{ band.type
            }}<strong v-if="band.type === 'tribute'"
              >: {{ band.tributeArtist }}</strong
            ></v-card-subtitle
          >
        </div>
        <v-card-text style="flex: 1">
          <v-avatar
            v-if="hasLogo"
            class="ma-3"
            size="130"
            tile
            style="float: left"
          >
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-img
                  style="cursor: pointer"
                  :src="band.logo"
                  @click="openPoster"
                  contain
                >
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute>
                      <v-btn fab small @click="openPoster">
                        <v-icon> zoom_in </v-icon>
                      </v-btn>
                    </v-overlay>
                  </v-fade-transition>
                </v-img>
              </template>
            </v-hover>
          </v-avatar>
          <div v-html="band.description"></div>
        </v-card-text>
        <v-card-text
          style="padding-top: 0"
          v-if="
            !inBand &&
            ((memberInfo.publicUser && band.isMembersPublic) ||
              !memberInfo.publicUser)
          "
        >
          <v-divider v-if="!inBand" style="clear: both"></v-divider>
          <v-subheader>{{$ml.get('bandMembers')}}</v-subheader>
          <v-chip v-for="(member, index) in band.bandMembers" :key="index" class="ma-1">
            <v-avatar left>
              <v-img :src="member.userPicture"></v-img>
            </v-avatar>
            {{ member.userDisplayName || member.userEmailAddress }}
          </v-chip>
        </v-card-text>
        <v-card-text
          style="padding-top: 0"
          v-if="band.genres && band.genres.length"
        >
          <v-divider style="clear: both"></v-divider>
          <v-subheader>{{$ml.get('genres')}}</v-subheader>
          <v-chip
            v-for="(genre, index) in band.genres"
            :key="index"
            class="ma-1"
          >
            {{ genre }}
          </v-chip>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text style="padding-top: 0" v-if="memberInfo.isAdmin">
          <v-subheader>{{$ml.get('visibility')}}</v-subheader>
          <div v-if="!band.isPublic">{{$ml.get('nothingIsPublic')}}</div>
          <v-chip v-if="band.isPublic" class="ma-1"> Public </v-chip>
          <v-chip v-if="band.isMembersPublic" class="ma-1">
            {{$ml.get('membersPublic')}}
          </v-chip>
          <v-chip v-if="band.isSetlistPublic" class="ma-1">
            {{$ml.get('setlistsPublic')}}
          </v-chip>
        </v-card-text>
        <v-card-text
          v-if="inBand && (memberInfo.isAdmin || memberInfo.canEditInfo)"
          style="padding: 0; position: relative"
        >
          <v-btn
            absolute
            dark
            small
            fab
            top
            right
            color="primary"
            @click="editBand()"
          >
            <v-icon> edit </v-icon>
          </v-btn>
        </v-card-text>
      </div>
    </v-expand-transition>
    <v-expansion-panels
      id="event-expansion"
      flat
      tile
      accordion
      v-model="setlistOpen"
      v-if="memberInfo.publicUser"
    >
      <v-expansion-panel v-if="band.events && band.events.length">
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <v-row no-gutters style="margin-left: 32px">
              <v-col cols="4"> Events </v-col>
              <v-col cols="8" class="text-right font-weight-bold">
                <v-fade-transition leave-absolute>
                  <span
                    v-if="
                      open &&
                      (!memberInfo.publicUser || $vuetify.breakpoint.smAndUp)
                    "
                    key="0"
                  >
                    {{ band.name }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="event in sortEvents(band.events)"
              v-bind:key="event._id"
            >
              <v-expansion-panel-header>
                <v-list three-line style="max-width: calc(100% - -24px);">
                  <v-list-item>
                    <v-list-item-avatar size="60" v-if="event.poster">
                      <v-img :src="event.poster"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="text-truncate"
                        v-html="event.locationName"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="getAddress(event.locationAddress)"
                      ></v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ moment(event.eventDate).format("LL") }}
                        <span v-if="event.eventTime">
                          - {{ event.eventTime }}</span
                        >
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                        icon
                        :href="event.locationURL"
                        target="_blank"
                        @click.stop="stopTheEvent"
                      >
                        <v-icon>near_me</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card>
                  <v-card-text style="padding-bottom: 0;">
                    <strong>{{event.locationName}}</strong>
                  </v-card-text>
                  <v-card-text>
                    {{ event.description }}
                  </v-card-text>
                  <v-subheader v-if="event.isSetlistPublic">
                    {{$ml.get('eventSetlist')}}
                  </v-subheader>
                  <SongList
                    :memberInfo="memberInfo"
                    :songList="event.setlist.filter(s => s.live)"
                    :inEvent="true"
                    :readOnly="true"
                    :duration="duration"
                    :elevation="0"
                    v-if="event.isSetlistPublic"
                  />
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="band.isSetlistPublic">
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <v-row no-gutters style="margin-left: 32px">
              <v-col cols="4"> Setlist </v-col>
              <v-col cols="8" class="text-right font-weight-bold">
                <v-fade-transition leave-absolute>
                  <span
                    v-if="
                      open &&
                      (!memberInfo.publicUser || $vuetify.breakpoint.smAndUp)
                    "
                    key="0"
                  >
                    {{ band.name }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn
            small
            text
            @click="playSetlist"
            v-if="songList.filter((s) => s.preview).length"
          >
            <v-icon left> play_arrow </v-icon>
            {{$ml.get('playSetlist')}}
          </v-btn>
          <SongList
            :memberInfo="memberInfo"
            :songList="songList"
            :inEvent="true"
            :readOnly="true"
            :duration="duration"
            :elevation="0"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions v-if="!inBand && !memberInfo.publicUser">
      <v-btn text @click="openBand()">{{$ml.get('open')}}</v-btn>
      <v-btn v-if="memberInfo.isCreator" text color="error" @click="modalDelete"
        >{{$ml.get('delete')}}</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
    <Confirm
      :dialog="dialog"
      @confirm="deleteBand"
      :title="modalTitle"
      :text="modalText"
      @close="dialog = false"
    />
  </v-card>
</template>

<script>
import Confirm from "../layout/Confirm.vue";
import SongList from "../song/SongList.vue";
export default {
  name: "BandCard",
  data() {
    return {
      dialog: false,
      modalTitle: "",
      modalText: "",
      hover: false,
      setlistOpen: undefined,
    };
  },
  components: {
    Confirm,
    SongList,
  },
  props: {
    band: Object,
    inBand: Boolean,
    memberInfo: Object,
  },
  methods: {
    modalDelete() {
      this.modalTitle = this.$ml.get("areYouSure");
      this.modalText = this.$ml.get("allBandDeleted");
      this.dialog = true;
    },
    async deleteBand() {
      await this.Service.bandService.deleteBand(this.band._id);
      this.$emit("submitted", this.$ml.get("bandDelated"));
    },
    openBand() {
      this.$router.push({
        path: `/band/${this.band._id}`,
      });
    },
    editBand() {
      this.$emit("edit");
    },
    openPoster() {
      this.$root.$emit("openImage", this.band.logo);
    },
    playSetlist() {
      this.$root.$emit("playSetlist", this.songList);
    },
    getAddress(address) {
      if (address) {
        return JSON.parse(address).formatted_address;
      }
    },
    sortEvents(events) {
      let _events = this.copy(events);
      return _events.sort((e1, e2) => {
        if (e1.eventDate < e2.eventDate) {
          return 1;
        } else if (e1.eventDate > e2.eventDate) {
          return -1;
        } else {
          if (e1.eventTime < e2.eventTime) {
            return 1;
          } else if (e1.eventTime > e2.eventTime) {
            return -1;
          }
        }
        return 0;
      });
    },
    stopTheEvent: (event) => event.stopPropagation(),
  },
  computed: {
    hasLogo() {
      return this.band && this.band.logo;
    },
    formatted_address() {
      if (this.band && this.band.location_address) {
        return this.band.location_address.formatted_address;
      } else {
        return "";
      }
    },
    songList() {
      return this.band.setlists
        ? this.band.setlists[0].songs.filter((s) => s.status === "confirmed")
        : [];
    },
    duration() {
      let setlist = this.songList;
      if (setlist && setlist.length) {
        return this.parseTime(
          setlist.map((s) => s.duration).reduce((a, c) => a + c)
        );
      } else {
        return "0:00";
      }
    },
  },
};
</script>

<style>
</style>
