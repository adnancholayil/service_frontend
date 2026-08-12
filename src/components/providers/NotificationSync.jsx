'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useSubscription } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { GET_NOTIFICATIONS } from '../../graphql/queries/notifications';
import { NOTIFICATION_RECEIVED_SUBSCRIPTION } from '../../graphql/subscriptions/notifications';
import { setNotifications, addNotification } from '../../store/slices/notificationSlice';

export default function NotificationSync() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fetch initial notifications list
  const { data, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { limit: 50 },
    skip: !isAuthenticated,
    fetchPolicy: 'network-only',
  });

  // Sync with redux store on initial load/change
  useEffect(() => {
    if (data?.notifications) {
      dispatch(setNotifications(data.notifications));
    }
  }, [data, dispatch]);

  // Handle logout / login changes
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setNotifications([]));
    } else {
      refetch?.();
    }
  }, [isAuthenticated, dispatch, refetch]);

  // Subscribe to new notifications on-the-fly
  const { data: subData } = useSubscription(NOTIFICATION_RECEIVED_SUBSCRIPTION, {
    variables: { userId: user?.id || '' },
    skip: !isAuthenticated || !user?.id,
  });

  // Handle incoming notification push
  useEffect(() => {
    if (subData?.notificationCreated) {
      const newNotif = subData.notificationCreated;
      dispatch(addNotification(newNotif));
      
      // Toast notification for instant feedback
      toast((t) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xs text-foreground">{newNotif.title}</p>
          <p className="text-[11px] text-muted-foreground">{newNotif.message}</p>
        </div>
      ), {
        icon: '🔔',
        duration: 5000,
      });
    }
  }, [subData, dispatch]);

  return null;
}
