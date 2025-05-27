import type { TLoginParams, TSignupParams, TUser } from '@/models/type';
import { defineStore } from 'pinia';
import { useCreditStore } from './creditStore';
import { showNotify } from '@/utils/notify';
import { v4 as uuidv4 } from 'uuid';

type PlayerStoreProps = {
  user: TUser | null;
  token: string | null;
  players: TUser[];
  activeTab: 'Signup-Tab' | 'Login-Tab';
  isModalVisible: boolean;
};

export const usePlayerStore = defineStore('playerStore', {
  state: (): PlayerStoreProps => ({
    user: null,
    token: null,
    players: [],
    activeTab: 'Signup-Tab',
    isModalVisible: false,
  }),
  getters: {
    getUser: (state) => state.user,
    getPlayers: (state) => state.players,
    getToken: (state) => state.token,
    isNewUser: (state) => state.user?.isNewUser || false,
    getActiveTab: (state) => {
      const storedTab = localStorage.getItem('activeTab');
      const validTabs = ['Signup-Tab', 'Login-Tab'] as const;

      if (storedTab && validTabs.includes(storedTab as (typeof validTabs)[number])) {
        return storedTab as 'Signup-Tab' | 'Login-Tab';
      }

      return state.activeTab;
    },
    getIsModalVisible: (state) => {
      const storedValue = localStorage.getItem('isModalVisible');
      try {
        const parsed = storedValue ? JSON.parse(storedValue) : null;
        return typeof parsed === 'boolean' ? parsed : state.isModalVisible;
      } catch {
        return state.isModalVisible;
      }
    },
  },
  actions: {
    setUser(newUser: TUser | null) {
      this.user = newUser;
    },
    setPlayers(newPlayers: TUser[]) {
      this.players = newPlayers;
    },
    setToken(newToken: string | null) {
      this.token = newToken;
    },
    setActiveTab(val: 'Signup-Tab' | 'Login-Tab') {
      this.activeTab = val;
      localStorage.setItem('activeTab', this.activeTab);
    },
    setIsModalVisible(val: boolean) {
      this.isModalVisible = val;
      localStorage.setItem('isModalVisible', JSON.stringify(this.isModalVisible));
    },
    updateIsNewUser(userId: string, isNewUser: boolean) {
      if (this.user && this.user.user_id === userId) {
        this.user.isNewUser = isNewUser;
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      const players_in_localstorage = localStorage.getItem('players');
      if (players_in_localstorage) {
        const updatedPlayers = JSON.parse(players_in_localstorage).map((item: TUser) =>
          item.user_id === userId ? { ...item, isNewUser } : item,
        );
        this.setPlayers(updatedPlayers);
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
      }
    },

    async handleSignup({ formE1, handleChangeTab }: TSignupParams) {
      if (!formE1) return;

      try {
        // Use the Promise version of validate
        await formE1.validate();

        const formData = {
          user_id: uuidv4(),
          phoneNumber: formE1.$props.model?.phoneNumber,
          password: formE1.$props.model?.password,
          total_money: formE1.$props.model?.total_money,
          transaction_history: formE1.$props.model?.transaction_history,
          created_at: new Date(),
          updated_at: new Date(),
          isNewUser: true,
        };

        if (!formData) return;

        // Get all saved players in local storage
        const players_in_localstorage = localStorage.getItem('players');

        // If there's no players, create one
        if (!players_in_localstorage) {
          const updatedPlayers = JSON.stringify([formData]);

          localStorage.setItem('players', updatedPlayers);

          showNotify({
            title: 'Success!',
            message: 'You have sign up successfully.',
            type: 'success',
          });

          console.log('Account created successfully!');

          handleChangeTab('Login-Tab');
          return;
        }

        // If player already exists with the same phoneNumber, return error
        const foundPlayer = JSON.parse(players_in_localstorage).find(
          (item: TUser) => item.phoneNumber === formData.phoneNumber,
        );

        if (foundPlayer) {
          throw new Error(`User already exists`);
        }

        // If new player and doesn't exist in local storage, add the new player
        const updatedPlayers = JSON.stringify([...JSON.parse(players_in_localstorage), formData]);

        localStorage.setItem('players', updatedPlayers);

        showNotify({
          title: 'Success!',
          message: 'You have sign up successfully.',
          type: 'success',
        });

        console.log('Account created successfully!', this.players);

        formE1.resetFields();

        handleChangeTab('Login-Tab');
      } catch (err) {
        // Validation or signup error
        if (err instanceof Error) {
          showNotify({
            title: 'Error!',
            message: err.message,
            type: 'error',
          });
        }
      }
    },
    async handleLogin({ formE1, handleCloseModal }: TLoginParams) {
      const creditStore = useCreditStore();

      if (!formE1) return;

      try {
        // Use the Promise version of validate
        await formE1.validate();

        const formData = formE1.$props.model;

        if (!formData) return;

        const players = localStorage.getItem('players');

        if (!players) throw new Error('Login failed! No players found. Please sign up first.');

        const foundPlayer: TUser = JSON.parse(players).find(
          (item: TUser) =>
            item.phoneNumber === formData.phoneNumber && item.password === formData.password,
        );

        if (!foundPlayer)
          throw new Error('Login failed! Please check your phone number or password.');

        this.setToken(foundPlayer.user_id);
        this.setUser({
          user_id: foundPlayer.user_id,
          phoneNumber: foundPlayer.phoneNumber,
          password: foundPlayer.password,
          total_money: foundPlayer.total_money,
          transaction_history: foundPlayer.transaction_history,
          created_at: foundPlayer.created_at,
          updated_at: foundPlayer.updated_at,
          isNewUser: foundPlayer.isNewUser || false,
        });

        localStorage.setItem('token', JSON.stringify(foundPlayer.user_id));
        localStorage.setItem(
          'user',
          JSON.stringify({
            user_id: foundPlayer.user_id,
            phoneNumber: foundPlayer.phoneNumber,
            password: foundPlayer.password,
            total_money: foundPlayer.total_money,
            transaction_history: foundPlayer.transaction_history,
            created_at: foundPlayer.created_at,
            updated_at: foundPlayer.updated_at,
            isNewUser: foundPlayer.isNewUser || false,
          }),
        );

        creditStore.handlePersistCredits();

        console.log('Logged in successfully!');

        showNotify({
          title: 'Success!',
          message: 'You have logged in successfully.',
          type: 'success',
        });

        handleCloseModal();
      } catch (err) {
        // Validation or login error
        if (err instanceof Error) {
          showNotify({
            title: 'Error!',
            message: err.message,
            type: 'error',
          });
        }
      }
    },
    handleLogout() {
      this.setUser(null);
      this.setToken(null);
      this.setPlayers([]);

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('activeTab');
      localStorage.removeItem('isModalVisible');
    },
    handlePersistLogin() {
      const userToken = localStorage.getItem('token');
      const foundUser = localStorage.getItem('user');
      const storedTab = localStorage.getItem('activeTab');
      // const storedModalVisible = localStorage.getItem('isModalVisible');

      if (!userToken || !foundUser) {
        console.log('Token or user not found!');
        return false;
      }

      try {
        const parsedUser = JSON.parse(foundUser);
        // const parsedModalVisible = storedModalVisible ? JSON.parse(storedModalVisible) : false;

        // Validate and set user and token
        this.setUser(parsedUser);
        this.setToken(parsedUser.user_id);

        // Set modal visibility
        // this.setIsModalVisible(
        //   typeof parsedModalVisible === 'boolean' ? parsedModalVisible : false,
        // );

        // Set active tab if it's a valid value
        const validTabs = ['Signup-Tab', 'Login-Tab'] as const;
        if (storedTab && validTabs.includes(storedTab as (typeof validTabs)[number])) {
          this.setActiveTab(storedTab as 'Signup-Tab' | 'Login-Tab');
        }

        return true;
      } catch (err) {
        console.error('Error while persisting login:', err);
        return false;
      }
    },
  },
});
