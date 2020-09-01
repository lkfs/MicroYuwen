<?php

namespace App\Console\Commands;

use App\Repositories\WordRepository;
use Illuminate\Console\Command;

class handleWord extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'word:handle';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    private $repository;
    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        //$this->repository = $_repository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $a = 'g';
        $b = 'ɡ';
        echo $a.' '.ord($a)."\n";
        echo $b.' '.ord($b)."\n";
        //return $this->repository->batchMark();
    }
}
