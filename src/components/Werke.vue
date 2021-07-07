<template>
  <v-container>
    <werk-trash-dialog
      v-model="showWerkTrashDialog"
      :werk="werkToTrash"
      @confirm="$store.dispatch(MOVE_TRASH, $event)"/>
    <werk-edit
      v-model="showWerkEdit"
      :werk="werkToEdit"/>
    <v-row>
      <v-col>
        <werk-table
          label="Hot Vault"
          icon="fire"
          enable-backup
          :disabled="gatheringWerke"
          :down-action="MOVE_FREEZE"
          :items="hotWerke"
          @edit="editWerk"
          @trash="trashWerk"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <werk-table
          label="Cold Vault"
          icon="snowflake"
          :disabled="gatheringWerke"
          :items="coldWerke"
          :up-action="MOVE_HEATUP"
          :down-action="MOVE_ARCHIVE"
          @edit="editWerk"
          @trash="trashWerk"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <werk-table
          label="Archive"
          icon="archive"
          :disabled="gatheringWerke"
          :items="archivedWerke"
          :up-action="MOVE_RETRIEVE"
          @edit="editWerk"
          @trash="trashWerk"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { v4 as uuid } from 'uuid';
import {
  MOVE_FREEZE,
  MOVE_HEATUP,
  MOVE_ARCHIVE,
  MOVE_RETRIEVE,
  MOVE_TRASH,
  WERK_STATE_HOT,
} from '@/store/types';
import WerkEdit from './WerkEdit.vue';
import WerkTable from './WerkTable.vue';
import WerkTrashDialog from './WerkTrashDialog.vue';

export default {
  components: {
    WerkEdit,
    WerkTable,
    WerkTrashDialog,
  },
  computed: {
    ...mapGetters([
      'gatheringWerke',
      'hotWerke',
      'coldWerke',
      'archivedWerke',
    ]),
  },
  data() {
    return {
      showWerkEdit: false,
      werkToEdit: null,
      showWerkTrashDialog: false,
      werkToTrash: null,
      MOVE_FREEZE,
      MOVE_HEATUP,
      MOVE_ARCHIVE,
      MOVE_RETRIEVE,
      MOVE_TRASH,
    };
  },
  methods: {
    createWerk() {
      this.werkToEdit = {
        id: uuid(),
        title: '',
        name: '',
        desc: '',
        created: new Date(),
        env: null,
        compressOnArchive: true,
        state: WERK_STATE_HOT,
        moving: false,
        history: [],
      };
      this.showWerkEdit = true;
    },
    editWerk(werk) {
      this.werkToEdit = werk;
      this.showWerkEdit = true;
    },
    trashWerk(werk) {
      this.showWerkTrashDialog = true;
      this.werkToTrash = werk;
    },
  },
};
</script>
