<?php


class Story extends Eloquent {


	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'Stories';

	protected $primaryKey = 'id';


	protected $guarded = array('id');

}
