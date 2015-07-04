<?php


class Beast extends Eloquent {


	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'BEASTS';

	protected $primaryKey = 'ID';


	protected $fillable = array('image');

}
