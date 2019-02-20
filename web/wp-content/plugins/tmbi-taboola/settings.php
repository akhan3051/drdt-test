<?php
add_action( 'admin_menu', 'tmbi_taboola_add_admin_menu' );
add_action( 'admin_init', 'tmbi_taboola_settings_init' );

/**
 * Add TMBI Taboola menu link
 */
function tmbi_taboola_add_admin_menu() {
	add_options_page( 'TMBI Taboola', 'TMBI Taboola', 'manage_options', 'tmbi_taboola', 'tmbi_taboola_options_page' );
}

/**
 * Register Taboola settings
 */
function tmbi_taboola_settings_init() {
	register_setting( 'taboola_publisher_id', 'tmbi_taboola_settings' );
	add_settings_section(
		'tmbi_taboola_taboola_integration_section',
		__( 'Taboola integration settings', 'taboola' ),
		'tmbi_taboola_settings_section_callback',
		'taboola_integration'
	);
	add_settings_field(
		'taboola_publisher_id',
		__( 'Publisher ID', 'taboola' ),
		'tmbi_taboola_publisher_id_render',
		'taboola_integration',
		'tmbi_taboola_taboola_integration_section'
	);
}

/**
 * Render Publisher ID field
 */
function tmbi_taboola_publisher_id_render() {
	$options = get_option( 'tmbi_taboola_settings' );
	$taboola_publisher_id = ! empty( $options['taboola_publisher_id'] ) ? $options['taboola_publisher_id'] : '';
	?>
	<input type='text' name='tmbi_taboola_settings[taboola_publisher_id]' value='<?php echo $options['taboola_publisher_id']; ?>'>
	<?php

}

/**
 * Add help text to Taboola integration settings
 */
function tmbi_taboola_settings_section_callback() {
	echo __( 'Configure Taboola integration', 'taboola' );
}

/**
 * Render options page
 */
function tmbi_taboola_options_page() {
	?>
	<form action='options.php' method='post'>
		<h2>TMBI Taboola</h2>
		<?php
		settings_fields( 'taboola_publisher_id' );
		do_settings_sections( 'taboola_integration' );
		submit_button();
		?>
	</form>
	<?php
}

function taboola_add_plugin_page_settings_link( $links ) {
	array_unshift( $links, '<a href="' . admin_url( 'options-general.php?page=tmbi_taboola' ) . '">' . __( 'Settings', 'taboola' ) . '</a>' );
	return $links;
}
