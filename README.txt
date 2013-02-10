Index.php has the necesarry elements for the game.
main.js has the code for the game.

as long as you have this elements

canvas with ID: canvas1 (preferely the size width 360px and height 600px)
and <p> with id scoreboard.

if you want another size you'll need to do some calculations.
the gridmap is devided in 20 rows and 12 columns all boxes are 30px*30px

20 * 30 = 600
12 * 30 = 360

you'll need to take your width / 12 (or the number of columns you want)
and the same for your height, height / 20 (or the number of rows you want)

this shall be fixed in initial function.
vertical (20), horizontal (12), and gridsize(30)
