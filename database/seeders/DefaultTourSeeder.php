<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DefaultTourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tour = \App\Tour::create([
            'title'=>'Default Tour',
            'active'=>0,
            'public'=>0,
            'tour_content' => json_decode('{
                "languages": [
                    "en"
                ],
                "use_template": true,
                "custom_base_map": {
                    "image": null,
                    "coords": {
                        "upperleft": {
                            "lat": null,
                            "lng": null
                        },
                        "lowerright": {
                            "lat": null,
                            "lng": null
                        }
                    },
                    "use_basemap": false
                }
            }'),
            'template' => 1
        ]);
         $stop = new \App\Stop;
        $stop->stop_content = json_decode('{
            "title": {
                "en": "Start",
                "placeholder": null
            },
            "stages": [
                {
                    "type": "language"
                },
                {
                    "text": {
                        "en": "Use the \"next\" button in the upper right to move to the next stop. Each stop will include navigation instructions, as well as informational material. \n\nSome stops may provide \"deep dives\". Select topics you\'re especially interested in. At the end of your tour, we\'ll give you a list of the topics you marked, with additional information so you can dive deeper.",
                        "placeholder": null
                    },
                    "type": "guide"
                },
                {
                    "text": {
                        "en": "You\'ll start the tour at XXX. You\'ll be walking approximately XX as you complete this tour.",
                        "placeholder": null
                    },
                    "type": "navigation",
                    "buttonTitle": {
                        "en": "Tour Preview"
                    },
                    "targetPoint": null
                }
            ]
        }');
        $stop->sort_order = 0;
        $tour->stops()->save($stop);
        $stop = new \App\Stop;
        $stop->stop_content = json_decode('{
            "title": {
                "en": "Finish",
                "placeholder": null
            },
            "stages": [
                {
                    "text": {
                        "en": "You\'ve made it to the end of the tour. We hope you enjoyed this experience. Please leave us feedback on your experience.",
                        "placeholder": null
                    },
                    "type": "guide"
                },
                {
                    "text": {
                        "placeholder": null
                    },
                    "type": "feedback"
                },
                {
                    "text": {
                        "en": "Deep Dives"
                    },
                    "type": "separator"
                },
                {
                    "text": {
                        "en": "Enter your email below to have a copy of this content emailed to you.",
                        "placeholder": null
                    },
                    "type": "deepdives-summary",
                    "request_email": true
                }
            ]
        }');
        $stop->sort_order = 1;
        $tour->stops()->save($stop);
    }
}
