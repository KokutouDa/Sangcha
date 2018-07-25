<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
$route['weapp'] = '/';
$route['weapp/(.+)'] = '$1';

$route['product']['get'] = 'product/getAll';
$route['product/offset/(:num)'] = 'product/getByOffset/$1';
$route['category/(:num)']['get'] = 'product/getByCategory/$1/';

$route['category']['get'] = 'category/get';

$route['token/login'] = 'token/login';
$route['token/user'] = 'token/getUser';

$route['order']['post'] = 'order/placeOrder';
$route['order/by_user/(:num)'] = 'order/getSummaryByUser/$1';
$route['order/(:num)'] = 'order/getDetail/$1';

$route['pay/pre_order']['post'] = 'pay/getPreOrder';
$route['pay/notify']['post'] = 'pay/receiveNotify';