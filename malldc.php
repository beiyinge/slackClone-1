<?php
/*if($_GET['mobile'] != 'no') {
	require_once '../content/Mobile_Detect.php';
	$detect = new Mobile_Detect;
	$deviceType = ($detect->isMobile() ? ($detect->isTablet() ? 'tablet' : 'phone') : 'computer');
	if($deviceType == 'phone') {
		header('Location: m_malldc.php');
		die();
	}
}*/
require_once 'common.php';
$meta="购物,商场,购物中心,奥特莱斯,Mall,Outlet,Outlets,Shopping,Shopping Center";
$title="购物中心大全 - 华盛顿购物 - 华府网";

$page=intval($_GET['page']);
if(!$page) $page=1;
$ord=$_GET['ord'];
//if(!$ord) $ordqry="displayorder DESC";
if(!$ord) $ord='cn2';
if($ord=='cn1')  $ordqry="chinesename ASC";
else if( $ord=='cn2') $ordqry="displayorder DESC";
//else if( $ord=='en1') $ordqry="englishname ASC";
//else if( $ord=='en2') $ordqry="englishname DESC";
else if( $ord=='ct1') $ordqry="city ASC";
else if( $ord=='ct2') $ordqry="displayorder DESC";
//else if( $ord=='ty1') $ordqry=" type ASC";
//else if( $ord=='ty2') $ordqry=" type DESC";
else if( $ord=='ve1') $ordqry="viewed DESC";
else if( $ord=='ra1') $ordqry="rate DESC";
else $ordqry="displayorder DESC";  
$db=db_connect();
$type_array=array("购物中心/Mall","奥特莱斯/Outlets");
$type_count=array();
$qry="select count(id) as num, type from mall group by type";
$result=mysql_query($qry) or die(mysql_error());
while($row=mysql_fetch_assoc($result)) {
  $type_count[$row['type']]=$row['num'];
}
$type=intval($_GET['ty']);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<?php include 'include/header.php' ?>
<style>
.categoryItem {width:200px;}
</style>
<body id="nv_portal" class="pg_index" onkeydown="if(event.keyCode==27) return false;">

<?php include 'include/topmenu.php' ?>
 
<div id="wp" class="wp cl">

<link rel="stylesheet" type="text/css" id="time_diy" href="../template/time_1st_niuhua/src/img/portaldiy.css?oLc" />
<script src="../template/time_1st_niuhua/src/js/superslide.2.1.js" type="text/javascript" type="text/javascript"></script>

<?php include 'include/top_ad.php' ?>

<div style="background-color:#f5f5f5;margin:5px 0;border:1px solid #ccc">
	<div style="font-size:14px;line-height:30px;padding:5px;float:left">
		<a href="http://www.chineseindc.com">华府网</a> &laquo; 
		<a href="http://www.chineseindc.com/yellowpages/">华府商家</a> &laquo; 
		<a href="http://www.chineseindc.com/yellowpages/malldc.php">华盛顿购物</a>
	</div>
	<div style="padding:5px;padding-right:20px;float:right">
<form action="yellowpages/searchbusiness.php" method="post">
<input name="bname" size="25" type="text" maxlength="20">
<input value="搜索商家" type="submit"></form>
	</div>
<div style="clear:both"></div>
</div>
	
<div class="wp">
<div style="width:660px;float:left">
<div style="margin:20px 0;font-size:14px;"><p><b>分类:</b></p>   

<div class="categoryItem"><img src="../images/linknav.gif"> <a href="yellowpages/malldc.php" 
<?php
if(!$type) print 'class="cGreen">全部商场</a></div>';
else print 'class="bluelink">全部商场</a></div>';

foreach ($type_array as $i => $value) {
	print '<div class="categoryItem"><img src="../images/linknav.gif"> <a href="yellowpages/malldc.php?ty='.($i+1).'" ';
	if($type&&$type==($i+1)) print 'class="cGreen">';
	else print '>';
	print $value.'('.$type_count[$i].')</a></div>';
}
?>
<div style="clear:both;"></div>
</div>



<div class="tabs tabs-style-linebox">
<nav>
<ul>
	<li<?php if($ord=='cn1'||$ord=='cn2') print ' class="tab-current"';?>><a href="yellowpages/malldc.php?ord=<?php if($ord=='cn1') print 'cn2';else print 'cn1';?>&ty=<?php print $type;?>"><span>名称排序</span></a></li>
	<li<?php if($ord=='ct1'||$ord=='ct2') print ' class="tab-current"';?>><a href="yellowpages/malldc.php?ord=<?php if($ord=='ct1') print 'ct2';else print 'ct1';?>&ty=<?php print $type;?>"><span>城市排序</span></a></li>
	<li<?php if($ord=='ve1'||$ord=='ve2') print ' class="tab-current"';?>><a href="yellowpages/malldc.php?ord=<?php if($ord=='ve1') print 've2';else print 've1';?>&ty=<?php print $type;?>"><span>人气排序</span></a></li>
	<li<?php if($ord=='ra1'||$ord=='ra2') print ' class="tab-current"';?>><a href="yellowpages/malldc.php?ord=<?php if($ord=='ra1') print 'ra2';else print 'ra1';?>&ty=<?php print $type;?>"><span>点评排序</span></a></li>
	<li><a href="yellowpages/mallmap.php"><span>商场分布图</span></a></li>
</ul>
</nav>
</div>
  
<?php
$qry="select count(id) as totalagent from mall where area=1";
if($type) $qry=$qry="select count(l.id) as totalagent from mall l, mall_category c where area=1 and l.id=c.id and c.category=".($type-1);
$result=mysql_query($qry) or die(mysql_error());
while($row=mysql_fetch_assoc($result)) {
   $totalagent = $row['totalagent'];
}
$maxpage = intval(($totalagent+9)/10);

if(!$type) $qry="select * from mall where area=1 order by ";
else $qry="select * from mall l, mall_category c where area=1 and l.id=c.id and c.category=".($type-1)." order by ";
$qry=$qry.$ordqry;
$qry=$qry." limit ".(($page-1)*10).",10";
//print $qry;die();
$i=0;
$result=mysql_query($qry) or die(mysql_error());
while($row=mysql_fetch_assoc($result)) {
    print '<div class="listheader">';
    $name=$row['chinesename'].' '.$row['englishname'];
    print '<a href="yellowpages/viewmall.php?id='.$row['id'].'" class="bluelink" target="_blank">'.text_filter($name).'</a>';
    print '</div>';

	print '<table width="100%"><tr><td valign="top">';
    print '<div class="listcontentsmall">';
    getsrateimg($row['rate']);
    print ' '.$row['reviews'].'人参与点评';
    print ' '.$row['viewed'].'人查阅 ';
    print '[<a href="yellowpages/viewmall.php?id='.$row['id'].'" target="_blank">详细信息</a>] ';
    print '[<a href="yellowpages/viewmall.php?id='.$row['id'].'&v=2" target="_blank">查看点评</a>] ';
    print '[<a href="yellowpages/viewmall.php?id='.$row['id'].'#rate" target="_blank">参与点评</a>] ';
    print '</div>';

    print '<div class="listcontent">分类: <a href="malldc.php?ty='.($row['type']+1).'">'.$type_array[$row['type']].'</a></div>';

    if(strlen($row['address'])>0) {
       $address=$row['address'].', ';
    }
    if(strlen($row['city'])>0) {
        $address=$address.$row['city'].', ';
    }
    if(strlen($row['state'])>0) {
        $address=$address.$row['state'].' ';
    }
    if(strlen($row['zip'])>0) {
        $address=$address.$row['zip'];
    }
    if(strlen($address)>10) print '<div class="listcontent">地址: <a href="yellowpages/viewmall.php?id='.$row['id'].'">'.$address.'</a></div>';

    $qry="select comment from mall_review where id=".$row['id']." and flag=0 order by post_date DESC limit 1";
    $reviewrs=mysql_query($qry);
    while($subrow=mysql_fetch_assoc($reviewrs)) {
	    $comment = text_filter($subrow['comment']);
		if(strlen($comment) > 100) $comment = cutString($comment, 100)."......";
		print '<div class="listcontent">点评: <a href="yellowpages/viewmall.php?id='.$row['id'].'&v=2">'.$comment.'</a></div>';
	}
	
    print '<div class="listcontentsmall" align="right">[<a href="yellowpages/viewmall.php?id='.$row['id'].'" target="_blank">查看详细信息</a>]</div>';

    print '</td><td width="145">';
	if($row['pics'] > 0) {
		print '<div class="photoframe">';
		print '<a href="yellowpages/viewmall.php?id='.$row['id'].'">';
		print '<img src="yellowpages/mall/thumbnail/'.$row['id'].'_1.jpg" border="0" width="145">';
		print '</a></div>';
	}
	print '</td></tr></table>';
}
//}
mysql_free_result($result);

//mysql_close();

?>

<div class="cl" style="padding:20px 0;">
<div class="pg">
<?php
	print '<a href="yellowpages/malldc.php?ord='.$ord.'&ty='.$type.'&page=1">首页</a>';
	if($page>1) print '<a href="yellowpages/malldc.php?ord='.$ord.'&ty='.$type.'&page='.($page-1).'">上一页</a>';

	$startp=$page-5;
	if($startp<1) $startp=1;
	$endp=$startp+9;
	if($endp>$maxpage) $endp=$maxpage;
	for($i=$startp;$i<=$endp;$i++) {
		if($page==$i) print "<strong>".$page."</strong> ";
		else print '<a href="yellowpages/malldc.php?ord='.$ord.'&ty='.$type.'&page='.$i.'">'.$i.'</a> ';
	}
	if($page < $maxpage)
		print '<a href="yellowpages/malldc.php?ord='.$ord.'&ty='.$type.'&page='.($page+1).'">下一页</a>';

	print '<a href="yellowpages/malldc.php?ord='.$ord.'&ty='.$type.'&page='.$maxpage.'">末页</a>';

?>
</div></div>
</div>

<div style="width:300px;float:right">
<?php require 'mallsidead.php' ?>
</div>

<?php 
mysql_close();
?>
<div style="clear:both"></div>
</div>

</div>
 
<?php include 'include/footer.php' ?>
</body></html>