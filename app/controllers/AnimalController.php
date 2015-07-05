<?php

class AnimalController extends Controller {

	public function getKingdoms(){
		$kingdoms = Animal::distinct()->select('Kingdom__matched')->get();

		return $kingdoms;
	}

	public function getPhylums($kingdom){
		$phylums = Animal::distinct()->select('Phylum__matched')
			->where('Kingdom__matched', '=', $kingdom)->get();

		return $phylums;
	}

	public function getClasses($phylum){
		$classes = Animal::distinct()->select('Class__matched')
			->where('Phylum__matched', '=', $phylum)->get();

		return $classes;
	}

	public function getOrders($class){
		$orders = Animal::distinct()->select('Order__matched')
			->where('Class__matched', '=', $class)->get();

		return $orders;
	}

	public function getFamilies($order){
		$families = Animal::distinct()->select('Family__matched')
			->where('Order__matched', '=', $order)->get();

		return $families;
	}

	public function getGenuses($family){
		$genuses = Animal::distinct()->select('Genus__matched')
			->where('Family__matched', '=', $family)->get();

		return $genuses;
	}

	public function getSpecies($genus){
		$species = Animal::distinct()->select('Species__matched')
			->where('Genus__matched', '=', $genus)->get();

		return $species;
	}

	public function getTree(){
		$kingdoms = array();
		foreach($this->getKingdoms() as $kingdom){

			$phylums = array();
			foreach($this->getPhylums($kingdom->Kingdom__matched) as $phylum){

				$classes = array();
				foreach($this->getClasses($phylum->Phylum__matched) as $class){

					$orders = array();
					foreach($this->getOrders($class->Class__matched) as $order){

						$families = array();
						foreach($this->getFamilies($order->Order__matched) as $family){

							$genuses = array();
							foreach($this->getGenuses($family->Family__matched) as $genus){

								$species = $this->getSpecies($genus->Genus__matched);
								
								$genus['species'] = $species;
								$genuses[] = $genus;
							}

							$family['genuses'] = $genuses;
							$families[] = $family;

						}

						$order['families'] = $families;
						$orders[] = $order;
					}

					$class['orders'] = $orders;
					$classes[] = $class;
				}

				$phylum['classes'] = $classes;
				$phylums[] = $phylum;
			}

			$kingdom['phylums'] = $phylums;
			$kingdoms[] = $kingdom;
		}

		return $kingdoms;
	}

	public function findPhotos(){

		$beasts = array();
		foreach(Beast::all() as $beast){
			$file = file_get_contents('http://environment.ehp.qld.gov.au/species/?op=getspeciesbyid&taxonid=' . 
				$beast->TaxonID);
			$file = json_decode($file, true);

			if(isset($file['Species']['Profile']['Image']['URL'])){
				Beast::find($beast->ID)->update(array('image'=> $file['Species']['Profile']['Image']['URL']));
				$beasts[] = Beast::find($beast->ID)->AcceptedCommonName;

			} 
			if(isset($file['Species']['Profile']['Image'][0]['URL'])){
				$beast->image = $file['Species']['Profile']['Image'][0]['URL'];
				$beast->save();
				$beasts[] = $beast->AcceptedCommonName;
			}



		}

		return $beasts;
	}

	public function getBeastData($id){

		$retArray = array();
		if(Beast::where('TaxonID', '=', $id)->count() > 0){

			$beast = Beast::where('TaxonID', '=', $id)->first();
			if(isset($beast->AcceptedCommonName)){

				$beastName = '% '.$beast->AcceptedCommonName.' %';
				$stories = Story::where(function ($query) use ($beastName){
					$query->where('Subjects', 'like', $beastName)
						  ->orWhere('Keywords', 'like', $beastName);
				})->get();

				$retArray[] = $stories;
			}

			$sightings = Sighting::where('TaxonID', '=', $id)
			->orderBy('Date', 'DESC');

			if($sightings->count() > 0){
				$sighting = $sightings->first();
				$retArray[] = array('longitude'=>$sighting->Longitude,
					'latitude'=>$sighting->Latitude, 'date'=>$sighting->Date);
			}

			$retArray[] = $beast;
		}

		return $retArray;
	}

	public function addSighting(){
		if(!Input::has('id') || !Input::has('lat') || !Input::has('lon')){
			return "failure";
		}

		try{
			$sighting = new Sighting;
			$sighting->TaxonID = Input::get('id');
			$sighting->Latitude = Input::get('lat');
			$sighting->Longitude = Input::get('lon');
			$sighting->Date = new DateTime();
			$sighting->save();

			return "success";
		} catch(Exception $e){
			return "failure";
		}
	}

	public function getLatestAPISiting($speciesName){
		try{
			$speciesName = str_replace(' ', '%20', $speciesName);
			$file =file_get_contents('http://environment.ehp.qld.gov.au/species/?op=getsurveysbyspecies&species=' . $speciesName);
			$file = json_decode($file, true);


			if(isset($file['features'])){

				$maxDate;
				$maxDateSet = false;
				$coordinates;
				foreach($file['features'] as $feature){

					if(isset($feature['properties']['EndDate']) &&
						isset($feature['geometry']['coordinates'])){

						$date = $feature['properties']['EndDate'];
						if(!$maxDateSet){
							$maxDate = $date;
							$coordinates = $feature['geometry']['coordinates'];
							$maxDateSet = true;
						}
						else if($date > $maxDate){
							$maxDate = $date;
							$coordinates = $feature['geometry']['coordinates'];
						}
					}
				}

				return array($maxDate, $coordinates);
			}

			return array();
		} catch (Exception $e){
			//return array($e->getMess);
			throw($e);
		}
	}

	public function treeTimeFunTime(){
		$retArray = array();
		foreach(Beast::distinct()->select('ClassName')
			->get() as $class){

			$classBeastQuery = Beast::where('ClassName', '=', $class->ClassName)
			->where('image', '!=', '0');

			if($classBeastQuery->count() == 0){
				continue;
			}

			$classBeast = $classBeastQuery->orderByRaw('RAND()')->first();


			$classArray = array();
			$classArray['children'] = array();
			$classArray['type'] = 'Class';
			$classArray['ClassName'] = $class->ClassName;
			$classArray['image'] = $classBeast->image;
			$classArray['imageName'] = isset($classBeast->AcceptedCommonName) ? $classBeast->AcceptedCommonName : $classBeast->ScientificName;
			$classArray['imageID'] = $classBeast->TaxonID;

			foreach(Beast::distinct()->select('FamilyName')
				->where('ClassName', '=', $class->ClassName)->get() as $family){

				$familyBeastQuery = Beast::where('FamilyName', '=', $family->FamilyName)
				->where('image', '!=', '0');

				if($familyBeastQuery->count() == 0){
					continue;
				}

				$familyBeast = $familyBeastQuery->orderByRaw('RAND()')->first();


				$familyArray = array();
				$familyArray['children'] = array();
				$familyArray['type'] = 'Family';
				$familyArray['FamilyName'] = $family->FamilyName;
				$familyArray['image'] = $familyBeast->image;
				$familyArray['imageName'] = isset($familyBeast->AcceptedCommonName) ? $familyBeast->AcceptedCommonName : $familyBeast->ScientificName;
				$familyArray['imageID'] = $familyBeast->TaxonID;

				foreach(Beast::where('image', '!=', '0')
					->where('FamilyName', '=', $family->FamilyName)
					->get() as $beast){

					$beastArray = array();
					$beastArray['image'] = $beast->image;
					$beastArray['imageName'] = isset($beast->AcceptedCommonName) ? $beast->AcceptedCommonName : $beast->ScientificName;
					$beastArray['imageID'] = $beast->TaxonID;

					$familyArray['children'][] = $beastArray;

				}	

				$classArray['children'][] = $familyArray;
			}

			$retArray[] = $classArray;


		}

		return $retArray;
	}

	public function ALLOFIT($kingdom = 'animals'){
		$classes = file_get_contents('http://environment.ehp.qld.gov.au/species/?op=getclassnames&kingdom=' . $kingdom);
		$classes = json_decode($classes, true);

		$count = 0;

		foreach($classes['Class'] as $class){
			$families = file_get_contents('http://environment.ehp.qld.gov.au/species/?op=getfamilynames&kingdom=' . 
				$kingdom . '&class=' . $class['ClassName']);
			$families = json_decode($families, true);

			if(isset($families['Family'])){
				foreach($families['Family'] as $family){
					$count++;
				}
			}



		}

		return $count;

	}

	public function getClassesImages($kingdom = 'animals'){
		try{

			$classes = file_get_contents('http://environment.ehp.qld.gov.au/species/?op=getclassnames&kingdom=' . $kingdom);
			$classes = json_decode($classes, true);

			$images = array();

			foreach($classes['Class'] as $class){
				$families = file_get_contents('http://environment.ehp.qld.gov.au/species/?op=getfamilynames&kingdom=' . 
					$kingdom . '&class=' . $class['ClassName']);
				$families = json_decode($families, true);

				$species = file_get_contents('http://environment.ehp.qld.gov.au/species/?op=getspecies&family=' . $families['Family'][0]['FamilyName']);
				$species = json_decode($species, true);


				if(isset($species['Species'])){

					$specie = file_get_contents($species['Species'][0]['SpeciesProfileUrl']);
					$specie = json_decode($specie, true);

					if(isset($specie['Species']['Profile']['Image']['URL'])){
						$images[] = array($specie['Species']['AcceptedCommonName'], $specie['Species']['Profile']['Image']['URL']);
					}
				}

				
				/*if(isset($specie['Profile'])){
					if(isset($specie['Profile']['Image'])){
						if(count($classImage) == 0){
							$classImage[0] = $specie['AcceptedCommonName'];
							$classImage[1] = $specie['Profile']['Image']['URL'];
						}

						$classImages[] = array($specie['AcceptedCommonName'], $specie['Profile']['Image']['URL']);
					}
				}*/

				//return $specie;



				//$images[] = array($classImage, $classImages);
			}

			return $images;

		} catch(Exception $e){
			return array($e->getMessage());
		}


	}

}
