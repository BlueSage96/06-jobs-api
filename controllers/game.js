const Game = require('../models/Game');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
// Game CRUD operations
const getAllGames = async (req, res) => {
  res.send("get all Games");
};

const getGame = async (req, res) => {
  res.send("get a Game");
};

const createGame = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const game = await Game.create(req.body);
  res.status(StatusCodes.CREATED).json({ game });
};

const updateGame = async (req, res) => {
  res.send("update Game");
};

const deleteGame = async (req, res) => {
  res.send("delete Game");
};

module.exports = { getAllGames, getGame, createGame, updateGame, deleteGame };
