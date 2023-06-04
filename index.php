<?php

                                          $ch = curl_init("https://www.convergepay.com/hosted-payments/myip");

                                          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                                          curl_setopt($ch, CURLOPT_HEADER, 0);

                                          $data = curl_exec($ch);

                                          echo $data;

                                          exit;

                            ?>