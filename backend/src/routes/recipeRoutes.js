const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

// Get all recipes
router.get('/', recipeController.getAllRecipes);

// Get a single recipe
router.get('/:id', recipeController.getRecipe);

// Create a new recipe
router.post('/', auth, recipeController.createRecipe);

// Update a recipe
router.put('/:id', auth, recipeController.updateRecipe);

// Delete a recipe
router.delete('/:id', auth, recipeController.deleteRecipe);

// Like a recipe
router.post('/:id/like', auth, recipeController.likeRecipe);

// Unlike a recipe
router.delete('/:id/like', auth, recipeController.unlikeRecipe);

// Add a comment
router.post('/:id/comments', auth, recipeController.addComment);

// Delete a comment
router.delete('/:id/comments/:commentId', auth, recipeController.deleteComment);

module.exports = router; 