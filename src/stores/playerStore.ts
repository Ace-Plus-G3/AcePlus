import type { TLoginParams, TSignupParams, TUser } from '@/models/type';
import { defineStore } from 'pinia';
import { useCreditStore } from './creditStore';

export const usePlayerStore = defineStore('playerStore', {
  state: () => ({
    user: null as TUser | null,
    token: null as string | null,
    players: [] as TUser[],
  }),
  getters: {
    getUser: (state) => state.user,
    getPlayers: (state) => state.players,
    getToken: (state) => state.token,
    isNewUser: (state) => state.user?.isNewUser || false,
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
    async handleSignup({ formE1, handleChangeTab }: TSignupParams) {
      if (!formE1) return;

      try {
        await formE1.validate((valid, fields) => {
          if (valid) {
            const formData = {
              user_id: crypto.randomUUID(),
              phoneNumber: formE1.$props.model?.phoneNumber,
              password: formE1.$props.model?.password,
              total_money: formE1.$props.model?.total_money,
              transaction_history: formE1.$props.model?.transaction_history,
              created_at: new Date(),
              updated_at: new Date(),
              isNewUser: true,
            };

            if (!formData) return;

            // Get all saves players in local storage
            const players_in_localstorage = localStorage.getItem('players');

            // If there's no players, create one
            if (!players_in_localstorage) {
              const updatedPlayers = JSON.stringify([formData]);
              localStorage.setItem('players', updatedPlayers);
              console.log('Account created successfully!');
              handleChangeTab('Login-Tab');
              return;
            }

            // If player already exists with the same email and phoneNumber, return error
            const foundPlayer = JSON.parse(players_in_localstorage).find(
              (item: TUser) => item.phoneNumber === formData.phoneNumber,
            );

            if (foundPlayer) {
              throw new Error(`User already exists`);
            }

            // If new player and doesn't exists in local storage, add the new player
            const updatedPlayers = JSON.stringify([
              ...JSON.parse(players_in_localstorage),
              formData,
            ]);
            localStorage.setItem('players', updatedPlayers);
            console.log('Account created successfully!', this.players);
            handleChangeTab('Login-Tab');
          } else {
            console.log('error submit!', fields);
          }
        });
      } catch (err) {
        throw new Error(`Signup failed: ${(err as Error).message}`);
      }
    },
    async handleLogin({ formE1, handleCloseModal }: TLoginParams) {
      const creditStore = useCreditStore();
      if (!formE1) return;

      try {
        await formE1.validate((valid, fields) => {
          if (valid) {
            const formData = formE1.$props.model;
            if (!formData) return;

            const players = localStorage.getItem('players');
            // If there's no players[] in local storage, send error
            if (!players) throw new Error('Players not found');

            // Find player trying to log in  via email
            const foundPlayer: TUser = JSON.parse(players).find(
              (item: TUser) =>
                item.phoneNumber === formData.phoneNumber && item.password === formData.password,
            );

            // If player not  found, send error
            if (!foundPlayer) throw new Error('Player not found');

            console.log(foundPlayer);
            // If player found, save the user info and token to pinia
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

            // Saves the user info and token to local storage
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
            handleCloseModal();
          } else {
            console.log('error submit!', fields);
          }
        });
      } catch (err) {
        throw new Error(`Login failed: ${(err as Error).message}`);
      }
    },
    async handleLogout() {
      this.setUser(null);
      this.setToken(null);
      this.setPlayers([]);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    handlePersistLogin() {
      const userToken = localStorage.getItem('token');

      if (!userToken) {
        console.log('Token not  fond!');
        return false;
      }

      // Fetch all players in local storage
      const foundUser = localStorage.getItem('user');
      if (!foundUser) {
        console.log('Player not found!');
        return false;
      }

      this.setUser(JSON.parse(foundUser));
      this.setUser(JSON.parse(foundUser));
      this.setToken(JSON.parse(foundUser).user_id);
      console.log('Persists!');
      return true;
    },
  },
});
