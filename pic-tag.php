<?php
/**
 * Plugin Name:       Pic Tag
 * Description:       Gutenberg block tag object in picture and display it.
 * Requires at least: 6.2.2
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            UjW0L
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       pic-tag
 *
 * @package           create-block
 */

 if ( ! defined( 'ABSPATH' ) ) exit; 

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_pic_tag_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_pic_tag_block_init' );
