const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// Like a recipe
exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user already liked the recipe
    if (recipe.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Recipe already liked' });
    }

    // Add user to likes array
    recipe.likes.push(req.user._id);
    await recipe.save();

    // Create notification for recipe owner
    if (recipe.userId.toString() !== req.user._id.toString()) {
      const recipeOwner = await User.findById(recipe.userId);
      const message = `${req.user.username} liked your recipe "${recipe.title}"`;
      const link = `/recipes/${recipe._id}`;
      
      await createNotification(
        recipe.userId,
        req.user._id,
        'like',
        message,
        link
      );
    }

    res.json({ message: 'Recipe liked successfully' });
  } catch (error) {
    console.error('Error liking recipe:', error);
    res.status(500).json({ message: 'Error liking recipe' });
  }
};

// Unlike a recipe
exports.unlikeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user has liked the recipe
    if (!recipe.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Recipe not liked yet' });
    }

    // Remove user from likes array
    recipe.likes = recipe.likes.filter(
      like => like.toString() !== req.user._id.toString()
    );
    await recipe.save();

    res.json({ message: 'Recipe unliked successfully' });
  } catch (error) {
    console.error('Error unliking recipe:', error);
    res.status(500).json({ message: 'Error unliking recipe' });
  }
};

// Add comment to recipe
exports.addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date()
    };

    recipe.comments.push(comment);
    await recipe.save();

    // Create notification for recipe owner if the commenter is not the owner
    if (recipe.userId.toString() !== req.user._id.toString()) {
      const message = `${req.user.username} commented on your recipe "${recipe.title}"`;
      const link = `/recipes/${recipe._id}`;
      
      await createNotification(
        recipe.userId,
        req.user._id,
        'comment',
        message,
        link
      );
    }

    // Also notify other users who commented on the recipe
    const uniqueCommenters = new Set(
      recipe.comments
        .filter(c => c.user.toString() !== req.user._id.toString() && c.user.toString() !== recipe.userId.toString())
        .map(c => c.user.toString())
    );

    for (const commenterId of uniqueCommenters) {
      const message = `${req.user.username} also commented on "${recipe.title}"`;
      const link = `/recipes/${recipe._id}`;
      
      await createNotification(
        commenterId,
        req.user._id,
        'comment',
        message,
        link
      );
    }

    res.json({ message: 'Comment added successfully', recipe });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Delete comment from recipe
exports.deleteComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const comment = recipe.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment owner or recipe owner
    if (comment.user.toString() !== req.user._id.toString() && 
        recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await recipe.save();

    res.json({ message: 'Comment deleted successfully', recipe });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
}; 