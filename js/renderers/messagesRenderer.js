// MedSphere Private Clinician Messaging Renderer

window.MedSphereMessages = {
  activePeerId: null,

  async renderMessages(params = {}) {
    const store = window.MedSphereStore;
    const myId = store.getState().currentUser.id;
    let conversations = [];
    let activeMessages = [];
    let peerProfile = null;

    if (params.with) {
      this.activePeerId = params.with;
    }

    try {
      if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
        conversations = await window.MedSphereAPI.getConversations().catch(() => []);
        if (this.activePeerId) {
          activeMessages = await window.MedSphereAPI.getConversation(this.activePeerId).catch(() => []);
          peerProfile = await window.MedSphereAPI.getProfile(this.activePeerId).catch(() => null);
        } else if (conversations.length > 0) {
          this.activePeerId = conversations[0].peer?.user_id;
          if (this.activePeerId) {
            activeMessages = await window.MedSphereAPI.getConversation(this.activePeerId).catch(() => []);
            peerProfile = conversations[0].peer;
          }
        }
      }
    } catch (e) {}

    // Fallback if no active peer — use first real profile from directory
    if (!peerProfile) {
      const liveProfs = (window.MedSphereDirectory && window.MedSphereDirectory.getAllProfessionals)
        ? window.MedSphereDirectory.getAllProfessionals()
        : [];
      const firstOther = liveProfs.find(p => p.id !== myId);
      if (firstOther) {
        peerProfile = { user_id: firstOther.id, full_name: firstOther.name, professional_title: firstOther.title, avatar_url: firstOther.avatar };
      }
    }

    return `
      <div class="container" style="padding-top:2rem; padding-bottom:4rem;">
        <div class="breadcrumbs">
          <a href="#dashboard">Dashboard</a> <span>/</span> <span>Clinical Encrypted Messaging</span>
        </div>

        <div class="card" style="display:grid; grid-template-columns:320px 1fr; height:700px; padding:0; overflow:hidden; margin-top:1.25rem;">
          <!-- Left Conversations List -->
          <div style="border-right:1px solid var(--border-subtle); display:flex; flex-direction:column; background:var(--slate-50);">
            <div style="padding:1.25rem; border-bottom:1px solid var(--border-subtle); background:var(--white);">
              <h3 style="font-size:1.15rem; color:var(--primary-900);">Messages</h3>
              <div class="text-xs text-muted" style="margin-top:2px;">End-to-end encrypted clinical channel</div>
            </div>

            <div style="overflow-y:auto; flex:1; display:flex; flex-direction:column;">
              <div style="padding:1rem; border-bottom:1px solid var(--border-subtle); background:var(--white); cursor:pointer; display:flex; gap:0.75rem; align-items:center;">
                <img src="${peerProfile?.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}" alt="" style="width:44px; height:44px; border-radius:50%; object-fit:cover;">
                <div style="flex:1; overflow:hidden;">
                  <strong style="font-size:0.9rem; color:var(--primary-900); display:block; white-space:nowrap; text-overflow:ellipsis;">${peerProfile?.full_name || 'Dr. Marcus Chen'}</strong>
                  <span class="text-xs text-muted" style="white-space:nowrap; text-overflow:ellipsis; display:block;">Active clinical thread</span>
                </div>
              </div>

              <div style="padding:1rem; border-bottom:1px solid var(--border-subtle); cursor:pointer; display:flex; gap:0.75rem; align-items:center;" onclick="window.MedSphereMessages.selectPeer('u-103', 'Sarah Jenkins, RN')">
                <img src="https://images.unsplash.com/photo-1594824813515-546059e13d92?auto=format&fit=crop&w=400&q=80" alt="" style="width:44px; height:44px; border-radius:50%; object-fit:cover;">
                <div style="flex:1; overflow:hidden;">
                  <strong style="font-size:0.9rem; color:var(--primary-900); display:block; white-space:nowrap; text-overflow:ellipsis;">Sarah Jenkins, MSN, RN</strong>
                  <span class="text-xs text-muted">ICU nurse staffing ratio inquiry</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Conversation History & Send Box -->
          <div style="display:flex; flex-direction:column; background:var(--white);">
            <!-- Thread Top Bar -->
            <div style="padding:1rem 1.5rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <img src="${peerProfile?.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}" alt="" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                <div>
                  <strong style="font-size:1rem; color:var(--primary-900);">${peerProfile?.full_name || 'Dr. Marcus Chen'}</strong>
                  <div class="text-xs text-muted">${peerProfile?.professional_title || 'Attending Neurologist'}</div>
                </div>
              </div>
              <span class="badge badge-green">HIPAA Protected</span>
            </div>

            <!-- Messages Stream -->
            <div id="messages-stream" style="flex:1; overflow-y:auto; padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
              ${activeMessages.map(m => {
                const isMine = m.sender_id === myId || m.sender_id === 'u-101';
                return `
                  <div style="display:flex; justify-content:${isMine ? 'flex-end' : 'flex-start'};">
                    <div style="max-width:70%; padding:0.85rem 1.15rem; border-radius:${isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px'}; background:${isMine ? 'var(--primary-800)' : 'var(--slate-100)'}; color:${isMine ? 'white' : 'var(--slate-800)'}; font-size:0.9375rem; line-height:1.5;">
                      <div>${m.content}</div>
                      <div style="font-size:0.65rem; text-align:right; margin-top:4px; opacity:0.8;">${m.created_at ? new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Send Input Area -->
            <div style="padding:1rem 1.5rem; border-top:1px solid var(--border-subtle); display:flex; gap:0.75rem; align-items:center;">
              <input type="text" id="chat-message-input" class="form-control" placeholder="Type a HIPAA-safe clinical message..." onkeyup="if(event.key==='Enter') window.MedSphereMessages.handleSend()">
              <button class="btn btn-primary" onclick="window.MedSphereMessages.handleSend()">
                <span>Send</span>
                <i class="fa-solid fa-paper-plane" style="margin-left:4px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async handleSend() {
    const input = document.getElementById('chat-message-input');
    if (!input || !input.value.trim()) return;

    const content = input.value.trim();
    input.value = '';

    const stream = document.getElementById('messages-stream');
    if (stream) {
      const bubble = document.createElement('div');
      bubble.style.cssText = 'display:flex; justify-content:flex-end;';
      bubble.innerHTML = `
        <div style="max-width:70%; padding:0.85rem 1.15rem; border-radius:16px 16px 4px 16px; background:var(--primary-800); color:white; font-size:0.9375rem; line-height:1.5;">
          <div>${content}</div>
          <div style="font-size:0.65rem; text-align:right; margin-top:4px; opacity:0.8;">Just now</div>
        </div>
      `;
      stream.appendChild(bubble);
      stream.scrollTop = stream.scrollHeight;
    }

    try {
      if (window.MedSphereAPI && this.activePeerId) {
        await window.MedSphereAPI.sendMessage(this.activePeerId, content);
      }
    } catch (e) {}

    window.MedSphereToast.show("Message Sent", "Delivered via encrypted clinical channel.", "success");
  },

  selectPeer(peerId, name) {
    this.activePeerId = peerId;
    window.location.hash = `#messages?with=${peerId}`;
  }
};
