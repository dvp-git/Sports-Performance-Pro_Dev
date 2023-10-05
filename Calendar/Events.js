"use strict";
const team_node = document.querySelectorAll(".team-nodes");
const btnCloseModal = document.querySelector(".close-modal");
const btnshowModal = document.querySelectorAll(".show-modal"); //
const block_nodes = document.querySelectorAll(".block_nodes");

// Add click event listeners to tree nodes
team_node.forEach((t) =>
  t.addEventListener("click", (e) => {
    const target = e.target;
    // console.log(`Outer Target:`,target)

    let vis_ = target.getAttribute("visibility");
    console.log(vis_);

    // BLOCK node clicked
    if (target.classList.contains("block-nodes")) {
      console.log("Entered is the block function");
      console.log(`Inner Target:`, target);
      let vis_ = target.getAttribute("visibility");
      console.log(vis_);
      if (Number(vis_) === 0) {
        console.log("Entered function ");
        // console.log(target)
        const exc_nodes = target.querySelectorAll(".exc_nodes");
        console.log(exc_nodes);
        exc_nodes.forEach((ex) => ex.classList.remove(["hidden"]));
        target.setAttribute("visibility", 1);
      } else {
        const exc_nodes = target.querySelectorAll(".exc_nodes");
        console.log(exc_nodes);
        exc_nodes.forEach((t) => t.classList.add(["hidden"]));
        target.setAttribute("visibility", 0);
      }
    } else {
      if (Number(vis_) === 0) {
        console.log("Entered Parent Team function ");
        // console.log(target)
        const block_nodes = target.querySelectorAll(".block-nodes");
        console.log(block_nodes);
        block_nodes.forEach((t) => t.classList.remove(["hidden"]));
        target.setAttribute("visibility", 1);
        console.log(target.querySelectorAll(".block-nodes"));
        //
      } else {
        const block_nodes = target.querySelectorAll(".block-nodes");
        console.log(block_nodes);
        block_nodes.forEach((t) => t.classList.add(["hidden"]));
        target.setAttribute("visibility", 0);
      }
    }
  })
);

// block_nodes.forEach(block => block.addEventListener("click", (e) => {
//     const target = e.target;
//     // console.log(`Target:`,target)
//     if (e.target.classList.contains('.block-nodes'))
//     {
//         console.log("This is the block function")
//     let vis_ =  target.getAttribute('visibility');
//     console.log(vis_);
//      if (Number(vis_) === 0)
//      {
//     console.log("Entered function ")
//     // console.log(target)
//     const exc_nodes = target.querySelectorAll('.exc_nodes');
//     console.log(exc_nodes)
//     exc_nodes.forEach(t => t.classList.remove(['hidden']));
//     target.setAttribute('visibility', 1);

//      }
//      else {
//         const exc_nodes = target.querySelectorAll('.exc_nodes');
//     console.log(exc_nodes)
//     exc_nodes.forEach(t => t.classList.add(['hidden']));
//     target.setAttribute('visibility', 0);
//      }
// }}));
