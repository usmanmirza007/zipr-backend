import express from 'express';

import * as controller from './controller';
const jwt = require('express-jwt')

import { secret_key } from '../../../secret'

export const userRouter = express.Router();

userRouter.route('/').get(jwt(secret_key), controller.getUsers);
userRouter.route('/edit').patch(jwt(secret_key), controller.editUser);

// userRouter.route('/tournament').post(jwt(secret_key), controller.createTournament);
// userRouter.route('/tournament').get(jwt(secret_key), controller.getAllTournament);
// userRouter.route('/tournament/:tournamentId').delete(jwt(secret_key), controller.deleteTournament);
// userRouter.route('/team').post(jwt(secret_key), controller.createTeam);
// userRouter.route('/team').get(jwt(secret_key), controller.getTeam);
// userRouter.route('/allTeam').get(jwt(secret_key), controller.getAllTeam);
// userRouter.route('/player/:teamId').post(jwt(secret_key), controller.createPlayer);
// userRouter.route('/player').get(jwt(secret_key), controller.getPlayer);
// userRouter.route('/player/:playerId').delete(jwt(secret_key), controller.deletePlayer);
// userRouter.route('/follow').post(jwt(secret_key), controller.tournamentFollow);
// userRouter.route('/follow').get(jwt(secret_key), controller.getTournamentFollow);
// userRouter.route('/match').post(jwt(secret_key), controller.createMatch);
// userRouter.route('/match').get(jwt(secret_key), controller.getMatch);

// userRouter.route('/:userId').delete(controller.deleteUser);
