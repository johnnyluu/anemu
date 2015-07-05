<?php


class Sighting extends Eloquent {


	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'Sightings';

	protected $primaryKey = 'ID';


	protected $guarded = array('ID');

}
